import { UserDetails } from 'src/app/shared/services/user-service';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from './../../shared/message-snackbar/snackbar-service';
import { UsersFormDialogComponent } from './../users-form-dialog/users-form-dialog.component';

@Component({
    selector: 'app-users-actions',
    templateUrl: './users-actions.component.html',
    styleUrls: ['./users-actions.component.css']
})
export class UsersActionsComponent {
    @Input() userDetails!: UserDetails;

    constructor(public dialog: MatDialog) {}

    onEdit(row: UserDetails) {
        const dialogRef = this.dialog.open(UsersFormDialogComponent, {
            width: '800px',
            minHeight: '500px',
            data: row
        });
    }
}
