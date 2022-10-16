import { ConfirmationDialogService } from './../../shared/confirmation-modal/confirmation-dialog.service';
import { SnackbarService, MessageTypes } from './../../shared/message-snackbar/snackbar-service';
import { GroupsMembersDialogComponent } from './../groups-members-dialog/groups-members-dialog.component';
import { GroupDTO, GroupService } from './../../shared/services/group-service';
import { GroupsFormDialogComponent } from './../groups-form-dialog/groups-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-groups-actions',
    templateUrl: './groups-actions.component.html',
    styleUrls: ['./groups-actions.component.css']
})
export class GroupsActionsComponent {
    @Input() groupDTO!: GroupDTO;

    constructor(
        public dialog: MatDialog,
        private groupService: GroupService,
        private snackbarService: SnackbarService,
        private confirmationService: ConfirmationDialogService
    ) {}

    onEdit(row: GroupDTO) {
        const dialogRef = this.dialog.open(GroupsFormDialogComponent, {
            width: '800px',
            minHeight: '500px',
            data: row
        });
    }

    onEditMembers(row: GroupDTO) {
        const dialogRef = this.dialog.open(GroupsMembersDialogComponent, {
            width: '1000px',
            minHeight: '500px',
            data: row
        });
    }

    onDelete(row: GroupDTO) {
        this.confirmationService.openConfirmDialog('Are you sure you want to delete this group?').subscribe((res) => {
            res && this.confirmDelete(row.id);
        });
    }

    private confirmDelete(id: string) {
        this.groupService.deleteById(id).subscribe(() => {
            this.snackbarService.openSnackBar('Group successfully deleted.', MessageTypes.SUCCESS);
            this.groupService.refresh.next(null);
        });
    }
}
