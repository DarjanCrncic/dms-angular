import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DocumentFormDialog } from './../document-form-dialog/document-form-dialog';

@Component({
  selector: 'app-document-add',
  template: `
    <button mat-raised-button (click)="openDialog()">New Document</button>
  `,
  styles: ['button {margin: 0 8px 8px 0;}'],
})
export class DocumentAddComponent implements OnInit {
  ngOnInit(): void {}
  @Input() folder: string = '/';

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DocumentFormDialog, {
      width: '800px',
      minHeight: '500px',
      data: { parent_folder: this.folder },
    });
  }
}
