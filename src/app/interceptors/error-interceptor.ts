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
        let errorMsg = `${res.status} ${res?.error?.message ?? res?.message ?? res}`;
        // if (error.error instanceof ErrorEvent) {
        //   errorMsg = `Error: ${error.error.message}`;
        // } else {
        //   errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
        // }
        this.snackbarService.openSnackBar(errorMsg, MessageTypes.ERROR);
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
