import { GroupService, GroupDTO } from './../services/group-service';
import { SnackbarService, MessageTypes } from './../message-snackbar/snackbar-service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, Subscription } from 'rxjs';
import { DocumentDTO } from './../../document-list/document.model';
import { FolderNode } from './../../folder-tree/folder-node.model';
import { AclClass, AdministrationService, GrantDTO } from './../services/administration-service';
import { UserDetails, UserService } from './../services/user-service';

export const permissionsAll = ['READ', 'WRITE', 'CREATE', 'VERSION', 'DELETE', 'ADMINISTRATION'];
@Component({
    selector: 'app-grant-rights-dialog',
    templateUrl: './grant-rights-dialog.component.html',
    styleUrls: ['./grant-rights-dialog.component.css']
})
export class GrantRightsDialogComponent implements OnInit, OnDestroy {
    form: FormArray = new FormArray<FormGroup>([]);
    permissionsAll = permissionsAll;
    users: UserDetails[] = [];
    groups: GroupDTO[] = [];
    isLoadingResults: boolean = false;
    errorMsg: string | null = null;
    private valueChangeSub: Subscription | null = null;

    constructor(
        public dialogRef: MatDialogRef<GrantRightsDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: { dto: DocumentDTO | FolderNode; type: AclClass },
        private userService: UserService,
        private administrationService: AdministrationService,
        private snackbarService: SnackbarService,
        private groupService: GroupService
    ) {}

    ngOnInit(): void {
        this.isLoadingResults = true;
        const userReq = this.userService.getAvailableUsers();
        const existingRightsReq = this.administrationService.getExistingRights(this.data.dto.id, this.data.type);
        const groupReq = this.groupService.getGroups();

        forkJoin([userReq, existingRightsReq, groupReq]).subscribe((resp) => {
            this.users = resp[0];
            this.groups = resp[2];
            this.isLoadingResults = false;

            resp[1].forEach((element) => {
                this.populateForm(element.username, element.permissions);
            });

            resp[1].length == 0 && this.populateForm('', []);
        });

        this.valueChangeSub = this.form.valueChanges.subscribe((values: GrantDTO[]) => {
            const usernameVals = values.map((val) => val.username);
            if (new Set(usernameVals).size !== usernameVals.length) {
                this.errorMsg = 'Duplicate entries for same user detected.';
            } else {
                this.errorMsg = null;
            }
        });
    }

    private populateForm(username: string, permissions: string[]) {
        this.form.push(
            new FormGroup({
                username: new FormControl(username, Validators.required),
                permissions: new FormControl(permissions, Validators.required)
            })
        );
    }

    getGroups() {
        return <FormGroup[]>this.form.controls;
    }

    removeEntry(index: number) {
        this.form.removeAt(index);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    addPermissionSet() {
        const permissionSet = new FormGroup({
            username: new FormControl('', Validators.required),
            permissions: new FormControl('', Validators.required)
        });

        this.form.push(permissionSet);
    }

    onSave() {
        if (!this.form.valid) return;

        this.isLoadingResults = true;
        this.administrationService.grantRights(this.data.dto.id, this.form.value, this.data.type).subscribe(
            (resp) => {
                this.form.clear();
                resp.forEach((element) => {
                    this.populateForm(element.username, element.permissions);
                    this.snackbarService.openSnackBar('Successfully updated permissions.', MessageTypes.SUCCESS);
                });
            },
            (error) => {
                this.isLoadingResults = false;
            },
            () => {
                this.isLoadingResults = false;
            }
        );
    }

    ngOnDestroy(): void {
        this.valueChangeSub && this.valueChangeSub.unsubscribe();
    }
}
