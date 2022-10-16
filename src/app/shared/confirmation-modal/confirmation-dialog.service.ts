import { Observable } from 'rxjs';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';

export class ConfirmDialogModel {
    title: string;
    message: string;

    constructor(title: string, message: string) {
        this.title = title;
        this.message = message;
    }
}

@Injectable({ providedIn: 'root' })
export class ConfirmationDialogService {
    constructor(public dialog: MatDialog) {}

    openConfirmDialog(message = 'Are you sure you want to proceed?') {
        const dialogData = new ConfirmDialogModel('Confirm Action', message);

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '600px',
            height: '250px',
            data: dialogData
        });

        return dialogRef.afterClosed();
    }
}
