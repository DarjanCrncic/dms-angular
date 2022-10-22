import { WebsocketService } from './shared/services/websocket-service';
import { Subscription, map, catchError, tap } from 'rxjs';
import { AccountService } from './security/account-service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    loginSubscription = new Subscription();

    constructor(private accountService: AccountService, private websocketService: WebsocketService) {}

    ngOnInit(): void {
        if (this.accountService.hasLocalData()) {
            this.accountService.updateAccountWithLocalData();
            this.websocketService.connect(this.accountService.account.token);
        }
    }
}
