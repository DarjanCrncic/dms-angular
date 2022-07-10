import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-grant-rights-dialog',
  templateUrl: './grant-rights-dialog.component.html',
  styleUrls: ['./grant-rights-dialog.component.css']
})
export class GrantRightsDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<GrantRightsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: null,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
