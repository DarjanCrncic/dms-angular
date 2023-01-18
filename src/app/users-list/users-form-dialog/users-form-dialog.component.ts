import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { UserDetails } from 'src/app/shared/services/user-service';
import { MessageTypes, SnackbarService } from './../../shared/message-snackbar/snackbar-service';
import { AdministrationService } from './../../shared/services/administration-service';
import { UserService } from './../../shared/services/user-service';
import { ErrorUtil } from './../../shared/validator-messages';

@Component({
    selector: 'app-users-form-dialog',
    templateUrl: './users-form-dialog.component.html',
    styleUrls: ['./users-form-dialog.component.css']
})
export class UsersFormDialogComponent implements OnInit {
    userForm: FormGroup = new FormGroup({});
    isEdit: boolean = false;
    roles: string[] = [];
    privileges: string[] = [];
    hide = true;
    loading = false;

    constructor(
        public dialogRef: MatDialogRef<UsersFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UserDetails,
        private snackbarService: SnackbarService,
        private administrationService: AdministrationService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.isEdit = this.data && this.data.id ? true : false;
        this.userForm = new FormGroup({
            username: new FormControl(this.isEdit ? this.data.username : null, [
                Validators.required,
                Validators.minLength(4)
            ]),
            email: new FormControl(this.isEdit ? this.data.email : null, [Validators.email, Validators.required]),
            first_name: new FormControl(this.isEdit ? this.data.first_name : null, [
                Validators.minLength(2),
                Validators.required
            ]),
            last_name: new FormControl(this.isEdit ? this.data.last_name : null, [
                Validators.minLength(2),
                Validators.required
            ]),
            role: new FormControl(this.isEdit ? this.data.role : '', [Validators.required]),
            privileges: new FormControl(this.isEdit ? this.data.privileges : []),
            enabled: new FormControl(this.isEdit ? this.data.enabled : true),
            password: new FormControl('')
        });
        const passwordControl = this.userForm.get('password');
        if (!this.isEdit) passwordControl?.setValidators([Validators.required, Validators.minLength(5)]);
        
        passwordControl?.valueChanges.subscribe((v: string) => {
            this.isEdit && this.userForm.get('password')?.setValidators(v ? [Validators.required, Validators.minLength(5)] : []);
        });

        this.getRolesAndPrivileges();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSaveClick() {
        const formVal = this.userForm.value;
        if (!this.userForm.valid) return;

        this.loading = true;
        if (this.data && this.data.id) {
            this.userService
                .updateUser(formVal, this.data.id)
                .pipe(finalize(() => (this.loading = false)))
                .subscribe(() => {
                    this.userService.refresh.next(null);
                    this.snackbarService.openSnackBar('User successfully updated.', MessageTypes.SUCCESS);
                    this.userForm.markAsPristine();
                });
        } else {
            this.userService
                .createUser(formVal)
                .pipe(finalize(() => (this.loading = false)))
                .subscribe(() => {
                    this.userService.refresh.next(null);
                    this.snackbarService.openSnackBar('User successfully created.', MessageTypes.SUCCESS);
                    this.userForm.markAsPristine();
                });
        }
    }

    getErrorMessage(controlName: string) {
        const control = this.userForm.get(controlName);
        return control && ErrorUtil.getErrorMessage(control);
    }

    isSaveDisabled() {
        return !this.userForm.valid || (!this.userForm.dirty && this.isEdit);
    }

    getRolesAndPrivileges() {
        this.administrationService.getRolesAndPrivileges().subscribe((res) => {
            this.roles = res.roles;
            this.privileges = res.privileges;
        });
    }
}
