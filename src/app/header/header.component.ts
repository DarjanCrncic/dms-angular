import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FolderTreeService } from 'src/app/folder-tree/folder-tree-service';
import { AccountService } from './../security/account-service';
import { MessageTypes, SnackbarService } from './../shared/message-snackbar/snackbar-service';
import { TestService } from './../shared/services/test-service';
import { NotificationMessage, WebsocketService } from './../shared/services/websocket-service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    constructor(
        private testService: TestService,
        private snackbarService: SnackbarService,
        private accountService: AccountService,
        private folderTreeService: FolderTreeService,
        private websocketService: WebsocketService,
        private router: Router
    ) {}

    firstName: string = '';
    lastName: string = '';
    unreadNotifications: boolean[] = [];
    notifications: NotificationMessage[] = [];
    private componentDestroyed$ = new Subject();

    ngOnInit(): void {
        const localAccount = this.accountService.getLocalData();
        this.firstName = localAccount && localAccount.first_name;
        this.lastName = localAccount && localAccount.last_name;

        this.accountService.newUserAnnouncment.pipe(takeUntil(this.componentDestroyed$)).subscribe((account) => {
            this.firstName = account.first_name;
            this.lastName = account.last_name;
        });

        this.websocketService.documents$.pipe(takeUntil(this.componentDestroyed$)).subscribe((message) => {
            if (!message) return;
            const body = JSON.parse(message.body) as NotificationMessage;
            if (this.accountService.shouldReceive(body.receivers)) {
                this.unreadNotifications.unshift(false);
                this.notifications.unshift(body);
            }
        });
    }

    onNotificationClick(linkTo: string) {
        this.router.navigate(['/dms']);
        this.folderTreeService.setCurrentFolder(linkTo);
    }

    markAsRead($event: any, index: number) {
        $event.stopPropagation();
        this.unreadNotifications[index] = true;
    }

    getUnreadCount() {
        return this.unreadNotifications.filter(item => item == false).length;
    }

    onLogoutClick() {
        this.accountService.logout();
        this.folderTreeService.clearLocalData();
    }

    logoutVissible() {
        return this.accountService.isLoggedIn();
    }

    onClick() {
        this.testService.getError().subscribe();
    }

    onFavClick() {
        this.snackbarService.openSnackBar('Test info', MessageTypes.INFO);
        this.websocketService.sendMessage('Testing websocket.');
    }

    ngOnDestroy() {
        this.componentDestroyed$.next(null);
    }

    isAdminRole() {
        return this.accountService.account.roles?.findIndex((role) => role === 'ROLE_ADMIN') > -1;
    }
}
