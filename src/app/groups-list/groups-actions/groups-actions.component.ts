import { GroupDTO } from './../../shared/services/group-service';
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

    constructor(public dialog: MatDialog) {}

    onEdit(row: GroupDTO) {
        const dialogRef = this.dialog.open(GroupsFormDialogComponent, {
            width: '800px',
            minHeight: '500px',
            data: row
        });
    }
}
