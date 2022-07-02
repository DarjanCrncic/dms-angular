import {
  SnackbarService,
  MessageTypes,
} from './../../shared/message-snackbar/snackbar-service';
import { DocumentService } from './../documents-service';
import { DocumentDTO } from './../document.model';
import {
  csvPattern,
  ValidatorMessages,
} from './../../shared/validator-messages';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Errors } from 'src/app/shared/validator-messages';
import { TypeDTO } from 'src/app/shared/type.model';
import { DocumentTypeService } from 'src/app/shared/services/document-type-service';

@Component({
  selector: 'document-form-dialog',
  templateUrl: 'document-form-dialog.html',
  styleUrls: ['./document-form-dialog.css'],
})
export class DocumentFormDialog implements OnInit {
  documentForm: FormGroup = new FormGroup({});
  types: TypeDTO[] = [];

  constructor(
    public dialogRef: MatDialogRef<DocumentFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentDTO,
    private typeService: DocumentTypeService,
    private documentService: DocumentService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    const isEdit = this.data && this.data.id;
    this.documentForm = new FormGroup({
      object_name: new FormControl(isEdit ? this.data.object_name : null, [
        Validators.required,
        Validators.minLength(4),
      ]),
      description: new FormControl(isEdit ? this.data.description : null),
      keywords: new FormControl(
        isEdit ? this.data.keywords.join(',') : null,
        Validators.pattern(csvPattern)
      ),
      type: new FormControl(isEdit ? this.data.type : 'document'),
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
      keywords: formVal.keywords ? formVal.keywords.split(',') : null,
    };
    if (this.data && this.data.id) {
      this.documentService
        .patchDocument(modifyDoc, this.data.id)
        .subscribe((response) => {
          this.documentForm.patchValue({
            ...response,
            keywords: response.keywords.toString(),
          });
          this.documentService.refreshDocuments.next('');
          this.snackbarService.openSnackBar(
            'Document successfully updated.',
            MessageTypes.SUCCESS
          );
        });
    } else {
      this.documentService
        .saveNewDocument({
          ...modifyDoc,
          parent_folder: this.data.parent_folder,
        })
        .subscribe((response) => {
          this.documentForm.patchValue(response);
          this.documentService.refreshDocuments.next('');
          this.snackbarService.openSnackBar(
            'Document successfully saved.',
            MessageTypes.SUCCESS
          );
        });
    }
  }

  getErrorMessage(controlName: string) {
    const control = this.documentForm.get(controlName);
    return control?.hasError('required')
      ? Errors.required
      : control?.hasError('minlength')
      ? ValidatorMessages.minimum(4)
      : control?.hasError('pattern')
      ? Errors.csv
      : null;
  }

  isSaveDisabled() {
    return !this.documentForm.valid || !this.documentForm.touched;
  }
}
