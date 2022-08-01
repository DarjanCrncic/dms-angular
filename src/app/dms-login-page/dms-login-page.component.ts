import { FolderTreeService } from 'src/app/folder-tree/folder-tree-service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Errors } from 'src/app/shared/validator-messages';
import { AccountService } from './../security/account-service';
import { ValidatorMessages } from './../shared/validator-messages';

@Component({
  selector: 'app-dms-login-page',
  templateUrl: './dms-login-page.component.html',
  styleUrls: ['./dms-login-page.component.css'],
})
export class DmsLoginPageComponent implements OnInit {
  constructor(
    private accountService: AccountService,
    private router: Router,
    private folderTreeService: FolderTreeService
  ) {}
  loginForm: FormGroup = new FormGroup({});
  errorMsg: string = '';
  buttonDisabled = false;

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('admin', [
        Validators.required,
        Validators.minLength(4),
      ]),
      password: new FormControl('12345', [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }

  getErrorMessage(controlName: string) {
    const control = this.loginForm.get(controlName);
    return control?.hasError('required')
      ? Errors.required
      : control?.hasError('minlength')
      ? ValidatorMessages.minimum(4)
      : null;
  }

  onLoginClick() {
    if (!this.loginForm.valid) return;
    const formVal = this.loginForm.value;
    this.buttonDisabled = true;
    this.accountService
      .login(formVal['username'], formVal['password'])
      .subscribe(
        (res) => {
          this.folderTreeService.setCurrentToRoot();
          this.router.navigate(['/dms']);
          this.errorMsg = '';
        },
        (error) => {
          this.errorMsg =
            error?.error?.status == 400 ? 'Invalid username or password.' : '';
        },
        () => {
          this.buttonDisabled = false;
        }
      );
  }
}
