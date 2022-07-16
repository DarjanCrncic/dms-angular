import { Subscription } from 'rxjs';
import { UserService } from './../shared/services/user-service';
import { AccountService } from './../security/account-service';
import {
  SnackbarService,
  MessageTypes,
} from './../shared/message-snackbar/snackbar-service';
import { TestService } from './../shared/services/test-service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    private testService: TestService,
    private snackbarService: SnackbarService,
    private accountService: AccountService,
  ) {}

  firstName: string = '';
  lastName: string= '';
  private newUserSub: Subscription | null = null;

  ngOnInit(): void {
    this.newUserSub = this.accountService.newUserAnnouncment.subscribe(account => {
      this.firstName = account.first_name;
      this.lastName = account.last_name;
    });
  }

  onLogoutClick() {
    this.accountService.logout();
  }

  logoutVissible() {
    return this.accountService.isLoggedIn();
  }

  onClick() {
    this.testService.getError().subscribe();
  }

  onFavClick() {
    this.snackbarService.openSnackBar('Test info', MessageTypes.INFO);
  }

  ngOnDestroy() {
    this.newUserSub && this.newUserSub.unsubscribe();
  }
}
