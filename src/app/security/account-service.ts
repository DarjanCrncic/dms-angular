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
  constructor(private htttpClient: HttpClient) {}

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
    localStorage.removeItem('dms_account');
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
  }

}
