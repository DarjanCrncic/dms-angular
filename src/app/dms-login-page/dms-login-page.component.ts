import {
  SnackbarService,
  MessageTypes,
} from './../shared/message-snackbar/snackbar-service';
import { Router } from '@angular/router';
import { AccountService } from './../security/account-service';
import { ValidatorMessages } from './../shared/validator-messages';
import { Errors } from 'src/app/shared/validator-messages';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dms-login-page',
  templateUrl: './dms-login-page.component.html',
  styleUrls: ['./dms-login-page.component.css'],
})
export class DmsLoginPageComponent implements OnInit {
  constructor(private accountService: AccountService, private router: Router) {}
  loginForm: FormGroup = new FormGroup({});
  errorMsg: string = '';

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
    this.accountService
      .login(formVal['username'], formVal['password'])
      .subscribe(
        (res) => {
          this.router.navigate(['/dms']);
          this.errorMsg = '';
        },
        (error) => {
          
          this.errorMsg = error?.error?.status == 400 ? 'Invalid username or password.' : '';
        }
      );
  }
}
