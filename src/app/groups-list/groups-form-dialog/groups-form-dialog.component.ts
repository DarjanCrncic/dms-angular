import { AdministrationService } from './../../shared/services/administration-service';
import { MessageTypes, SnackbarService } from './../../shared/message-snackbar/snackbar-service';
import { GroupDTO, GroupService } from './../../shared/services/group-service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorUtil } from 'src/app/shared/validator-messages';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-groups-form-dialog',
    templateUrl: './groups-form-dialog.component.html',
    styleUrls: ['./groups-form-dialog.component.css']
})
export class GroupsFormDialogComponent implements OnInit {
    groupForm: FormGroup = new FormGroup({});
    isEdit: boolean = false;
    roles: string[] = [];
    privileges: string[] = [];
    loading = false;

    constructor(
        public dialogRef: MatDialogRef<GroupsFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: GroupDTO,
        private snackbarService: SnackbarService,
        private groupService: GroupService
    ) {}

    ngOnInit(): void {
        this.isEdit = this.data && this.data.id ? true : false;
        this.groupForm = new FormGroup({
            group_name: new FormControl(this.isEdit ? this.data.group_name : null, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(32)
            ]),
            identifier: new FormControl(this.isEdit ? this.data.identifier : null, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(32)
            ]),
            description: new FormControl(this.isEdit ? this.data.description : null)
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSaveClick() {
        const formVal = this.groupForm.value;
        if (!this.groupForm.valid) return;

        this.loading = true;
        if (this.data && this.data.id) {
            this.groupService
                .updateGroup(formVal, this.data.id)
                .pipe(finalize(() => (this.loading = false)))
                .subscribe(() => {
                    this.groupService.refresh.next(null);
                    this.snackbarService.openSnackBar('Group successfully updated.', MessageTypes.SUCCESS);
                    this.groupForm.markAsPristine();
                });
        } else {
            this.groupService
                .createGroup(formVal)
                .pipe(finalize(() => (this.loading = false)))
                .subscribe(() => {
                    this.groupService.refresh.next(null);
                    this.snackbarService.openSnackBar('Group successfully created.', MessageTypes.SUCCESS);
                    this.groupForm.markAsPristine();
                });
        }
    }

    getErrorMessage(controlName: string) {
        const control = this.groupForm.get(controlName);
        return control && ErrorUtil.getErrorMessage(control);
    }

    isSaveDisabled() {
        return !this.groupForm.valid || (!this.groupForm.dirty && this.isEdit);
    }
}
