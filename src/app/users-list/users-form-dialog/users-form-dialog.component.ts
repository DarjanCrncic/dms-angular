import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, finalize, takeUntil } from 'rxjs';
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
export class UsersFormDialogComponent implements OnInit, OnDestroy {
    userForm = this.fb.group({
        username: this.fb.control('', [
            Validators.required,
            Validators.minLength(4)
        ]),
        email: this.fb.control('', [Validators.email, Validators.required]),
        first_name: this.fb.control('', [
            Validators.minLength(2),
            Validators.required
        ]),
        last_name: this.fb.control('', [
            Validators.minLength(2),
            Validators.required
        ]),
        role: this.fb.control('', [Validators.required]),
        privileges: this.fb.control<string[]>([]),
        enabled: this.fb.control(true),
        password: this.fb.control('')
    });

    isEdit: boolean = false;
    roles: string[] = [];
    privileges: string[] = [];
    hide = true;
    loading = false;
    
    private componentDestroyed$ = new Subject();

    constructor(
        public dialogRef: MatDialogRef<UsersFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UserDetails,
        private snackbarService: SnackbarService,
        private administrationService: AdministrationService,
        private userService: UserService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.isEdit = this.data && this.data.id ? true : false;
        this.isEdit && this.userForm.setValue({
            username: this.data.username,
            email: this.data.email,
            first_name: this.data.first_name,
            last_name: this.data.last_name,
            role: this.data.role,
            privileges: this.data.privileges ?? [],
            enabled: this.data.enabled,
            password: ''
        });
        if (!this.isEdit) this.userForm.controls.password.setValidators([Validators.required, Validators.minLength(5)]);
        
        this.userForm.controls.password.valueChanges.pipe(takeUntil(this.componentDestroyed$)).subscribe(v => {
            this.isEdit && this.userForm.controls.password.setValidators(v ? [Validators.required, Validators.minLength(5)] : []);
        });

        this.userForm.controls.privileges.valueChanges.pipe(takeUntil(this.componentDestroyed$)).subscribe(v => {
            if (!!v && v.length > 0 && !v.includes('READ_PRIVILEGE')) {
                this.userForm.controls.privileges.setValue([...v, 'READ_PRIVILEGE'], { emitEvent: false });
            }
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
                .updateUser(formVal as UserDetails, this.data.id)
                .pipe(finalize(() => (this.loading = false)))
                .subscribe(() => {
                    this.userService.refresh.next(null);
                    this.snackbarService.openSnackBar('User successfully updated.', MessageTypes.SUCCESS);
                    this.userForm.markAsPristine();
                });
        } else {
            this.userService
                .createUser(formVal as UserDetails)
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

    getRolesAndPrivileges() {
        this.administrationService.getRolesAndPrivileges().subscribe((res) => {
            this.roles = res.roles;
            this.privileges = res.privileges;
        });
    }

    ngOnDestroy(): void {
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }
}
