import { FolderTreeService } from './../../folder-tree/folder-tree-service';
import { FlatTreeNode } from '../../folder-tree/folder-tree-service';
import { SnackbarService, MessageTypes } from './../message-snackbar/snackbar-service';
import { Errors, validFolderName } from './../validator-messages';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { FolderService } from './../../folder-tree/folder-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-rename-dialog',
  templateUrl: './rename-dialog.component.html',
  styleUrls: ['./rename-dialog.component.css']
})
export class RenameDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<RenameDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { update: boolean; node: FlatTreeNode },
    private folderService: FolderService,
    private snackbarService: SnackbarService,
    private folderTreeService: FolderTreeService
  ) {}

  nameForm: FormGroup = new FormGroup({});

  ngOnInit(): void {
    const pathArray = this.data.node.name.split('/');
    const name = pathArray[pathArray.length - 1];

    this.nameForm = new FormGroup({
      nameControl: new FormControl(this.data.update ? name : '', [
        Validators.pattern(validFolderName),
        Validators.required
      ])
    });
  }

  onSave() {
    if (this.data.update) {
      const newFolderName = this.nameForm.value['nameControl'];
      this.folderService.updateFolderPath(this.data.node.id, newFolderName).subscribe((res) => {
        this.snackbarService.openSnackBar('Folder successfully updated.', MessageTypes.SUCCESS);
        this.folderTreeService.updateNode(this.data.node.id, res);
      });
    } else {
      const newFolderName = this.nameForm.value['nameControl'];
      this.folderService.createNewFolder(newFolderName, this.data.node.id).subscribe((res) => {
        this.snackbarService.openSnackBar('Folder successfully created.', MessageTypes.SUCCESS);
        this.folderTreeService.addNodeToTree(this.data.node, res);
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  getErrorMessage(controlName: string) {
    const control = this.nameForm.get(controlName);
    return control?.hasError('required') ? Errors.required : control?.hasError('pattern') ? Errors.alphaNumeric : null;
  }

  getTitle() {
    return this.data.update ? 'Folder update' : 'Add folder';
  }
}
