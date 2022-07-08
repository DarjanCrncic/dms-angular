import { AccountService } from './../security/account-service';
import {
  SnackbarService,
  MessageTypes,
} from './../shared/message-snackbar/snackbar-service';
import { TestService } from './../shared/services/test-service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private testService: TestService,
    private snackbarService: SnackbarService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {}

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
}
