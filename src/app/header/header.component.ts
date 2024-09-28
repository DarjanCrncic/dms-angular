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
    loggedIn = this.accountService.loggedIn$;
    loading = false;
    private componentDestroyed$ = new Subject();

    ngOnInit(): void {
        const localAccount = this.accountService.getLocalData();
        this.firstName = localAccount && localAccount.first_name;
        this.lastName = localAccount && localAccount.last_name;

        this.accountService.newUserAnnouncement.pipe(takeUntil(this.componentDestroyed$)).subscribe((account) => {
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

        if (this.accountService.hasLocalData()) {
            this.refreshNotifications();
        }
    }

    refreshNotifications() {
        this.notificationService
            .getNotifications()
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe((res) => {
                this.notifications = res;
            });
    }

    onNotificationClick(notification: DmsNotification) {
        this.router.navigate(['/dms']);
        this.markAsRead(null, notification);
        this.folderTreeService.setCurrentFolder(notification.link_to);
    }

    markAsRead($event: any, notification: DmsNotification) {
        $event?.stopPropagation();
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

    deleteNotification($event: any, id: string) {
        $event?.stopPropagation();
        this.notificationService.clearById(id).subscribe(() => {
            const index = this.notifications.findIndex(n => n.id == id);
            index >= 0 && this.notifications.splice(index, 1);
        });
    }
}
