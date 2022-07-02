import { ApiPaths } from 'src/app/api-paths';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface Account {
  username: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AccountService {
  constructor(private htttpClient: HttpClient) {}

  private _account: Account = {
    username: '',
    token: '',
  };

  login() {
    return this.htttpClient.post(
      environment.host + ApiPaths.AuthLogin,
      {
        username: 'admin',
        password: '12345',
      }
    );
  }

  public set account(v: any) {
    this._account = v;
  }

  public get account() {
    return this._account;
  }
}
