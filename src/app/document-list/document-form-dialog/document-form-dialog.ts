import { SnackbarService, MessageTypes } from './../../shared/message-snackbar/snackbar-service';
import { DocumentService } from './../documents-service';
import { DocumentDTO } from './../document.model';
import { csvPattern, ErrorUtil } from './../../shared/validator-messages';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DocumentTypeService, TypeDTO } from 'src/app/shared/services/document-type-service';
import { FolderTreeService } from 'src/app/folder-tree/folder-tree-service';
import { finalize } from 'rxjs/operators';
import { ROOT } from 'src/app/constants';

@Component({
    selector: 'app-document-form-dialog',
    templateUrl: 'document-form-dialog.html',
    styleUrls: ['./document-form-dialog.css']
})
export class DocumentFormDialogComponent implements OnInit {
    documentForm: FormGroup = new FormGroup({});
    types: TypeDTO[] = [];
    isEdit: boolean = false;
    loading: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<DocumentFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DocumentDTO,
        private typeService: DocumentTypeService,
        private documentService: DocumentService,
        private snackbarService: SnackbarService,
        private folderTreeService: FolderTreeService
    ) {}

    ngOnInit(): void {
        this.isEdit = this.data && this.data.id ? true : false;
        this.documentForm = new FormGroup({
            object_name: new FormControl(this.isEdit ? this.data.object_name : null, [
                Validators.required,
                Validators.minLength(4)
            ]),
            description: new FormControl(this.isEdit ? this.data.description : null),
            keywords: new FormControl(this.isEdit ? this.data.keywords.join(',') : '', Validators.pattern(csvPattern)),
            type: new FormControl(this.isEdit ? this.data.type : 'document')
        });

        this.typeService.getAllDocumentTypes().subscribe((response) => {
            this.types = response;
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSaveClick() {
        const formVal = this.documentForm.value;
        if (!this.documentForm.valid) return;

        const modifyDoc = {
            ...formVal,
            keywords: formVal.keywords ? formVal.keywords.split(',') : null
        };
        this.loading = true;

        if (this.data && this.data.id) {
            this.documentService.patchDocument(modifyDoc, this.data.id).pipe(finalize(() => this.loading = false))
                .subscribe((response) => {
                    this.documentForm.patchValue({
                        ...response,
                        keywords: response.keywords.toString()
                    });
                    this.documentService.refreshDocuments.next('');
                    this.snackbarService.openSnackBar('Document successfully updated.', MessageTypes.SUCCESS);
            });
        } else {
            const currentFolder = this.folderTreeService.getCurrentFolder();
            currentFolder &&
                this.documentService
                    .saveNewDocument({
                        ...modifyDoc,
                        parent_folder_id: currentFolder.id,
                        root_folder: currentFolder.name == ROOT
                    })
                    .pipe(finalize(() => this.loading = false))
                    .subscribe((response) => {
                        this.documentForm.patchValue({
                            ...response,
                            keywords: response.keywords.toString()
                        });
                        this.documentService.refreshDocuments.next('');
                        this.snackbarService.openSnackBar('Document successfully saved.', MessageTypes.SUCCESS);
                    });
        }
    }

    getErrorMessage(controlName: string) {
        const control = this.documentForm.get(controlName);
        return control && ErrorUtil.getErrorMessage(control);
    }

    isSaveDisabled() {
        return !this.documentForm.valid || (!this.documentForm.dirty && this.isEdit);
    }
}
