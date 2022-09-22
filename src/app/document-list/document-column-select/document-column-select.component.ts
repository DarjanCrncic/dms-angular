import {
  ColumnOption,
  DocumentColumnService
} from './../document-column-service';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

@Component({
  selector: 'app-document-column-select',
  templateUrl: './document-column-select.component.html',
  styleUrls: ['./document-column-select.component.css']
})
export class DocumentColumnSelectComponent {

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DocumentColumnDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}

@Component({
  selector: 'app-document-column-dialog',
  templateUrl: 'document-column-dialog.html'
})
export class DocumentColumnDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DocumentColumnDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: [],
    private colService: DocumentColumnService
  ) {}

  ngOnInit(): void {
    this.documentColumns = this.colService.getAllColumns();
  }

  documentColumns: ColumnOption[] = [];

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick() {
    this.colService.saveNewColumns(this.documentColumns);
  }

  toggleSelection(event: any) {
    const index = this.documentColumns.findIndex(
      (col) => col.identifier === event.option.value
    );
    this.documentColumns[index].displayed = event.option.selected;
  }
}
