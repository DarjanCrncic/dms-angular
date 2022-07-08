import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { SnackbarService, MessageTypes } from './../shared/message-snackbar/snackbar-service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private snackbarService: SnackbarService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((res: HttpErrorResponse) => {
        console.log(res)
        let errorMsg = '';

        switch (res.status) {
          case 500: 
            errorMsg = '500: Internal server error.';
            break;
          case 401: 
            errorMsg = '401: Unauthorized.';
            break;
          default:
            errorMsg = `${res?.error?.message ?? res?.message ?? res}`;
        }
     
        this.snackbarService.openSnackBar(errorMsg, MessageTypes.ERROR);
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
