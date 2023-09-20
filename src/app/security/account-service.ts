import { WebsocketService } from './../shared/services/websocket-service';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService, MessageTypes } from './../shared/message-snackbar/snackbar-service';
import { Router } from '@angular/router';
import { ApiPaths } from 'src/app/api-paths';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { tap, Subject, BehaviorSubject } from 'rxjs';

export interface Account {
    username: string;
    token: string;
    expires_at: number;
    first_name: string;
    last_name: string;
    privileges: string[];
    roles: string[];
    group_identifiers: string[];
}

@Injectable({ providedIn: 'root' })
export class AccountService {
    constructor(
        private httpClient: HttpClient,
        private router: Router,
        private snackbarService: SnackbarService,
        private dialogRef: MatDialog,
        private websocketService: WebsocketService
    ) {}
    private authTimer: ReturnType<typeof setTimeout> | null = null;
    newUserAnnouncement: Subject<Account> = new Subject();
    private loggedIn = new BehaviorSubject(false);
    loggedIn$ = this.loggedIn.asObservable();

    private _account: Account = {
        username: '',
        token: '',
        expires_at: 0,
        first_name: '',
        last_name: '',
        roles: [],
        privileges: [],
        group_identifiers: []
    };

    login(username: string, password: string) {
        return this.httpClient
            .post<Account>(environment.host + ApiPaths.AuthLogin, {
                username: username,
                password: password
            })
            .pipe(
                tap((res) => {
                    this.setSession(res);
                    this._account = res;
                    this.startAuthenticationTimer(this._account.expires_at - Date.now());
                    this.newUserAnnouncement.next(res);
                    this.websocketService.connect(this.account.token);
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
        this.loggedIn.next(false);
        this._account.token = '';
        this._account.expires_at = 0;
        localStorage.removeItem('dms_account');

        this.authTimer && clearTimeout(this.authTimer);
        this.authTimer = null;

        this.dialogRef.closeAll();
        this.snackbarService.closeAll();
        this.router.navigate(['/login']);

        this.websocketService.disconnect();
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
        this.newUserAnnouncement.next(this._account);
        this.startAuthenticationTimer(this._account.expires_at - Date.now());
    }

    getLocalData() {
        const localAccount = localStorage.getItem('dms_account');
        return localAccount ? JSON.parse(localAccount) : null;
    }

    startAuthenticationTimer(expiration: number) {
        this.loggedIn.next(true);
        this.authTimer = setTimeout(() => {
            this.logout();
            this.snackbarService.openSnackBar('Your login info expired.', MessageTypes.INFO);
        }, expiration);
    }
    
    isUserOrMember(username: string) {
        return this.account.username == username || this.account.group_identifiers.includes(username);
    }

    shouldReceive(receivers: string[]) {
        let should = false;
        receivers.forEach(rec => should = should || this.isUserOrMember(rec));
        return should;
    }
}
