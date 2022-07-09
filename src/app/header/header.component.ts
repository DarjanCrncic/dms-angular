import { UserService } from './../shared/services/user-service';
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
    private accountService: AccountService,
    private userService: UserService
  ) {}

  firstName: string = '';
  lastName: string= '';

  ngOnInit(): void {
    this.userService.getUserDetails(this.accountService.account.username).subscribe(res => {
      this.firstName = res.first_name;
      this.lastName = res.last_name;
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
}
