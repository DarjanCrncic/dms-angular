import {
  SnackbarService,
  MessageTypes,
} from './../shared/message-snackbar/snackbar-service';
import { Router } from '@angular/router';
import { ApiPaths } from 'src/app/api-paths';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs';

export interface Account {
  username: string;
  token: string;
  expires_at: number;
}

@Injectable({ providedIn: 'root' })
export class AccountService {
  constructor(
    private htttpClient: HttpClient,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}
  private authTimer: ReturnType<typeof setTimeout> | null = null;

  private _account: Account = {
    username: '',
    token: '',
    expires_at: 0,
  };

  login(username: string, password: string) {
    return this.htttpClient
      .post<Account>(environment.host + ApiPaths.AuthLogin, {
        username: username,
        password: password,
      })
      .pipe(
        tap((res) => {
          this.setSession(res);
          this._account = res;
          this.startAuthenticationTimer(this._account.expires_at - Date.now());
        })
      );
  }

  public get account() {
    return this._account;
  }

  private setSession(account: Account) {
    localStorage.setItem('dms_account', JSON.stringify(account));
  }

  logout() {
    this._account.token = '';
    this._account.expires_at = 0;
    localStorage.removeItem('dms_account');

    this.authTimer && clearTimeout(this.authTimer);
    this.authTimer = null;

    this.router.navigate(['/login']);
  }

  public isLoggedIn() {
    const currentDate = Date.now();
    const expiresAt = this._account.expires_at;
    return expiresAt > currentDate;
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  public hasLocalData(): boolean {
    const localAccount = localStorage.getItem('dms_account');
    return localAccount ? true : false;
  }

  public updateAccountWithLocalData() {
    const localAccount = localStorage.getItem('dms_account');
    if (!localAccount) return;

    this._account = JSON.parse(localAccount);
    this.startAuthenticationTimer(this._account.expires_at - Date.now());
  }

  startAuthenticationTimer(expiration: number) {
    this.authTimer = setTimeout(() => {
      this.logout();
      this.snackbarService.openSnackBar(
        'Your login info expired.',
        MessageTypes.INFO
      );
    }, expiration);
  }
}
