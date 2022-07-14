import { DocumentDTO } from './../../document-list/document.model';
import { AclClass, AdministrationService, GrantDTO } from './../services/administration-service';
import { UserService, UserDetails } from './../services/user-service';
import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, Subscription } from 'rxjs';

export const permissionsAll = [
  'READ',
  'WRITE',
  'CREATE',
  'DELETE',
  'ADMINISTRATION',
];
@Component({
  selector: 'app-grant-rights-dialog',
  templateUrl: './grant-rights-dialog.component.html',
  styleUrls: ['./grant-rights-dialog.component.css'],
})
export class GrantRightsDialogComponent implements OnInit, OnDestroy {
  form: FormArray = new FormArray([]);
  permissionsAll = permissionsAll;
  users: UserDetails[] = [];
  isLoadingResults: boolean = false;
  errorMsg: string | null = null;
  private valueChangeSub: Subscription | null = null;

  @Input() entityClass: string = 'document';

  constructor(
    public dialogRef: MatDialogRef<GrantRightsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentDTO,
    private userService: UserService,
    private administrationService: AdministrationService
  ) {}

  ngOnInit(): void {
    this.isLoadingResults = true;
    const userReq = this.userService.getAvailableUsers();
    const existingRightsReq = this.administrationService.getExistingRights(
      this.data.id, AclClass.DOCUMENT
    );

    forkJoin([userReq, existingRightsReq]).subscribe((resp) => {
      this.users = resp[0];
      this.isLoadingResults = false;

      resp[1].forEach((element) => {
        this.populateForm(element.username, element.permissions);
      });

      resp[1].length == 0 && this.populateForm('', []);
    });

    this.valueChangeSub = this.form.valueChanges.subscribe((values: GrantDTO[]) => {
      const usernameVals = values.map(val => val.username);
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
        permissions: new FormControl(permissions, Validators.required),
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
      permissions: new FormControl('', Validators.required),
    });

    this.form.push(permissionSet);
  }

  onSave() {
    if (!this.form.valid) return;

    this.isLoadingResults = true;
    this.administrationService
      .grantRights(this.data.id, this.form.value)
      .subscribe(
        (resp) => {
          this.form.clear();
          resp.forEach((element) => {
            this.populateForm(element.username, element.permissions);
          });
        },
        (error) => {},
        () => {
          this.isLoadingResults = false;
        }
      );
  }

  getPermissions() {
    return this.entityClass == 'document'
      ? permissionsAll.filter((perm) => perm != 'CREATE')
      : permissionsAll;
  }

  ngOnDestroy(): void {
    this.valueChangeSub && this.valueChangeSub.unsubscribe();
  }
}
