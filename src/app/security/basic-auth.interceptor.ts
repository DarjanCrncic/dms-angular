import { AuthInterceptors } from './../../environments/environment';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (environment.authInterceptor !== AuthInterceptors.BASIC) return next.handle(req);

    const modified = req.clone({
      headers: req.headers.append('Authorization', 'Basic YWRtaW46MTIzNDU='),
      // headers: req.headers.append('Authorization', 'Basic ZWRpdG9yOjEyMzQ1'),
    });
    return next.handle(modified);
  }
}
