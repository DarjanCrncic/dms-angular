import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class ValidatorMessages {
  static minimum(min: number): string {
    return 'Minimum length: ' + min + ' characters.';
  }
}

export const Errors = {
  required: 'This field is required.',
  csv: 'Must be a list of comma separated values.',
  alphaNumeric: 'Characters allowed: [a-zA-Z0-9_]'
};

export const csvPattern = /^[^,][\w|,| ]*[^,]$|^$|^\w$/;
export const validFolderName = /^\w+$/;
