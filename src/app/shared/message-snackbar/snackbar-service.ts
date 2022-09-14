import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { MessageSnackbarComponent } from './message-snackbar.component';

export const MessageTypes = {
  ERROR: 'mat-error-msg',
  SUCCESS: 'mat-success-msg',
  INFO: 'mat-info-msg'
};

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(messagage: string, type: string) {
    this.snackBar.openFromComponent(MessageSnackbarComponent, {
      duration: 2000,
      data: messagage,
      panelClass: ['mat-toolbar', type]
    });
  }
}
