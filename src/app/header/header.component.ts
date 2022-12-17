import { DmsNotification, NotificationService } from './../shared/services/notification-service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FolderTreeService } from 'src/app/folder-tree/folder-tree-service';
import { AccountService } from './../security/account-service';
import { MessageTypes, SnackbarService } from './../shared/message-snackbar/snackbar-service';
import { WebsocketService } from './../shared/services/websocket-service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    constructor(
        private snackbarService: SnackbarService,
        private accountService: AccountService,
        private folderTreeService: FolderTreeService,
        private websocketService: WebsocketService,
        private notificationService: NotificationService,
        private router: Router
    ) {}

    firstName: string = '';
    lastName: string = '';
    notifications: DmsNotification[] = [];
    private componentDestroyed$ = new Subject();

    ngOnInit(): void {
        const localAccount = this.accountService.getLocalData();
        this.firstName = localAccount && localAccount.first_name;
        this.lastName = localAccount && localAccount.last_name;

        this.accountService.newUserAnnouncment.pipe(takeUntil(this.componentDestroyed$)).subscribe((account) => {
            this.firstName = account.first_name;
            this.lastName = account.last_name;
            this.refreshNotifications();
        });

        this.websocketService.documents$.pipe(takeUntil(this.componentDestroyed$)).subscribe((message) => {
            if (!message) return;
            const body = JSON.parse(message.body) as DmsNotification;
            if (this.accountService.shouldReceive([body.recipient])) {
                this.notifications.unshift(body);
            }
        });

        this.refreshNotifications();
    }

    refreshNotifications() {
        this.notificationService
            .getNotifications()
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe((res) => {
                this.notifications = res;
            });
    }

    onNotificationClick(linkTo: string) {
        this.router.navigate(['/dms']);
        this.folderTreeService.setCurrentFolder(linkTo);
    }

    markAsRead($event: any, notification: DmsNotification) {
        $event.stopPropagation();
        !notification.seen && this.websocketService.registerNotification(notification.id);
        notification.seen = true;
    }

    getUnreadCount() {
        return this.notifications.filter((item) => item.seen == false).length;
    }

    onLogoutClick() {
        this.notifications = [];
        this.accountService.logout();
        this.folderTreeService.clearLocalData();
    }

    logoutVissible() {
        return this.accountService.isLoggedIn();
    }

    onClick() {
        this.snackbarService.openSnackBar('Test error', MessageTypes.ERROR);
    }

    onFavClick() {
        this.snackbarService.openSnackBar('Test info', MessageTypes.INFO);
    }

    ngOnDestroy() {
        this.componentDestroyed$.next(null);
    }

    isAdminRole() {
        return this.accountService.account.roles?.findIndex((role) => role === 'ROLE_ADMIN') > -1;
    }

    clearAll() {
        this.notificationService.clear().subscribe(res => {
            this.notifications = [];
        });
    }
    
    getLocaleDate(date: Date) {
        const obj = new Date(date);
        return obj.toLocaleString();
    }
}
