import { Subscription } from 'rxjs';
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

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit(): void {
    if (this.accountService.hasLocalData()) {
      this.accountService.updateAccountWithLocalData();
      this.router.navigate(['/dms']);
    }
  }
}
