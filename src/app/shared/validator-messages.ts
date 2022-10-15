import { AbstractControl } from '@angular/forms';
export class ErrorUtil {
    static getErrorMessage(control: AbstractControl) {
        if (control?.hasError('required')) {
            return Errors.required;
        }
        if (control?.hasError('minlength')) {
            const reqLen = control.getError('minlength').requiredLength;
            return ValidatorMessages.minimum(reqLen);
        }
        if (control?.hasError('pattern')) {
            return Errors.csv;
        }
        if (control?.hasError('email')) {
            return Errors.email;
        }
        return null;
    }
}
export class ValidatorMessages {
    static minimum(min: number): string {
        return 'Minimum length: ' + min + ' characters.';
    }
}

export const Errors = {
    required: 'This field is required.',
    csv: 'Must be a list of comma separated values.',
    alphaNumeric: 'Characters allowed: [a-zA-Z0-9_].',
    email: 'Must be a valid email.'
};

export const csvPattern = /^[^,][\w|,| ]*[^,]$|^$|^\w$/;
export const validFolderName = /^\w+$/;
