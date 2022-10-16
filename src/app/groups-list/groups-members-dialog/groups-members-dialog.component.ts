import { Utils } from './../../shared/utils';
import { UserDetails, UserService } from './../../shared/services/user-service';
import { GroupsFormDialogComponent } from './../groups-form-dialog/groups-form-dialog.component';
import { GroupService, GroupDTO } from './../../shared/services/group-service';
import { SnackbarService, MessageTypes } from './../../shared/message-snackbar/snackbar-service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-groups-members-dialog',
    templateUrl: './groups-members-dialog.component.html',
    styleUrls: ['./groups-members-dialog.component.css']
})
export class GroupsMembersDialogComponent implements OnInit {
    members: UserDetails[] = [];
    hiddenMembers: string[] = [];
    nonMembers: UserDetails[] = [];
    hiddenNonMembers: string[] = [];
    allUsers: UserDetails[] = [];
    loading = false;

    constructor(
        public dialogRef: MatDialogRef<GroupsFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: GroupDTO,
        private snackbarService: SnackbarService,
        private groupService: GroupService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.loading = true;
        this.members = [...this.data.members];

        this.userService.getAvailableUsers().subscribe((res) => {
            this.allUsers = res;
            this.loading = false;

            const memberIds = this.members.map((member) => member.username);
            this.nonMembers = this.allUsers.filter((user) => !memberIds.includes(user.username));
        });
    }

    drop(event: CdkDragDrop<UserDetails[]>) {
        // if (event.previousContainer === event.container) {
        //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        // } else {
        // transferArrayItem(
        //         event.previousContainer.data,
        //         event.container.data,
        //         event.previousIndex,
        //         event.currentIndex
        //     );
        // }
        if (event.previousContainer != event.container) {
            const movedUser = event.item.data;
            const index = event.previousContainer.data.findIndex((member) => member.username == movedUser.username);
            transferArrayItem(event.previousContainer.data, event.container.data, index, event.currentIndex);
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSaveClick() {
        this.loading = true;
        this.groupService
            .updateMembers(
                this.members.map((member) => member.id),
                this.data.id
            )
            .subscribe((res) => {
                this.loading = false;
                this.data.members = res.members;
                this.groupService.refresh.next(null);
                this.snackbarService.openSnackBar('Group members updated.', MessageTypes.SUCCESS);
            });
    }

    isSaveDisabled() {
        const oldMembers = this.data.members.map((member) => member.username);
        const newMembers = this.members.map((member) => member.username);
        return Utils.equalsIgnoreOrder(oldMembers, newMembers);
    }

    handleNonMembersSearch(search: string) {
        this.hiddenNonMembers = this.handleSearch(search, this.nonMembers);
    }

    handleMembersSearch(search: string) {
        this.hiddenMembers = this.handleSearch(search, this.members);
    }

    handleSearch(search: string, res: any[]) {
        return res
            .filter(
                (user) =>
                    !(
                        user.first_name.includes(search) ||
                        user.last_name.includes(search) ||
                        user.username.includes(search)
                    )
            )
            .map((user) => user.id);
    }
}
