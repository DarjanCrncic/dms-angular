import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Account, AccountService } from './account-service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateChildAdministration implements CanActivateChild {
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
    return this.accountService.account.roles?.findIndex((role) => role === 'ROLE_ADMIN') > -1;
  }
}
