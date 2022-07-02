import { Account, AccountService } from './security/account-service';
import { Subscription } from 'rxjs';
import { SidebarService } from './sidebar-service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  opened = true;
  sidebarSubscription = new Subscription();
  loginSubscription = new Subscription();

  constructor(private sidebarService: SidebarService, private accountService: AccountService) {}

  ngOnInit(): void {
    this.loginSubscription = this.accountService.login().subscribe((response) => {
      this.accountService.account = response;
    });
    this.sidebarSubscription = this.sidebarService.toggleSidebar.subscribe(
      (event) => {
        this.onToggleEvent();
      }
    );
  }
  ngOnDestroy(): void {
    this.sidebarSubscription && this.sidebarSubscription.unsubscribe();
    this.loginSubscription && this.loginSubscription.unsubscribe();
  }

  onToggleEvent() {
    this.opened = !this.opened;
  }
}
