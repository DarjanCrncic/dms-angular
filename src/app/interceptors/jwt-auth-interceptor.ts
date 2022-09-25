import { AccountService } from './../security/account-service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthInterceptors } from './../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (environment.authInterceptor !== AuthInterceptors.JWT) return next.handle(request);

    const account = this.accountService.account;
    const token = account?.token;
    const isApiUrl = request.url.startsWith(environment.baseUrl);
    if (token && isApiUrl && this.accountService.isLoggedIn()) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${account.token}` }
      });
    } else if (isApiUrl && !this.accountService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('401 Unauthorized.'));
    }

    return next.handle(request);
  }
}
