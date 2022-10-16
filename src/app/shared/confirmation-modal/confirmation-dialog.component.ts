import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ConfirmDialogModel } from './confirmation-dialog.service';

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {
    title: string;
    message: string;

    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel
    ) {
        this.title = data.title;
        this.message = data.message;
    }

    onConfirm(): void {
        this.dialogRef.close(true);
    }

    onDismiss(): void {
        this.dialogRef.close(false);
    }
}
