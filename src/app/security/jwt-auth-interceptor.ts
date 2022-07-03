import { ApiPaths } from 'src/app/api-paths';
import { AuthInterceptors } from './../../environments/environment';
import { AuthInterceptor } from './basic-auth.interceptor';
import { AccountService } from './account-service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (environment.authInterceptor !== AuthInterceptors.JWT)
      return next.handle(request);

    const account = this.accountService.account;
    const token = account?.token;
    const isApiUrl = request.url.startsWith(environment.baseUrl);
    if (token && isApiUrl && this.accountService.isLoggedIn()) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${account.token}` },
      });
    }

    return next.handle(request);
  }
}
