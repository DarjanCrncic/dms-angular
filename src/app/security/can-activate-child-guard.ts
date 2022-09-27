import { Account, AccountService } from './account-service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree, CanActivateChild } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CanActivateChildDms implements CanActivateChild {
  constructor(private accountService: AccountService, private router: Router) {}

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const enabled = this.canActivateRoute(this.accountService.account, route.params['id']);
    if (enabled) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

  canActivateRoute(account: Account, id: string): boolean {
    return this.accountService.isLoggedIn();
  }
}
