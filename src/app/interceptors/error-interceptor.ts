import { MessageSnackbarComponent } from '../shared/error-snackbar/message-snackbar.component';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(errorMsg: string) {
    this.snackBar.openFromComponent(MessageSnackbarComponent, {
      duration: 2000,
      data: errorMsg,
      panelClass: ['mat-toolbar', 'mat-error']
    });
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
        }
        this.openSnackBar(errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
