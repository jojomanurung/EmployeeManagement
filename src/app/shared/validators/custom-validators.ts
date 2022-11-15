import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static email(control: AbstractControl): { [key: string]: any } | null {
    let emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return CustomValidators.regExp(emailPattern, 'email')(control);
  }

  static regExp(pattern: RegExp, name: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (isEmptyInputValue(control.value)) {
        return null; // don't validate when control is empty
      }

      return pattern.test(control.value) ? null : { [name]: control.value };
    };
  }

  static arrayString(array: string[], name: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (isEmptyInputValue(control.value)) {
        return null; // don't validate when control is empty
      }

      const stringMatch = !!array.find((element) => element === control.value);

      return stringMatch ? null : { [name]: control.value };
    };
  }
}

function isEmptyInputValue(value: any) {
  return (
    value == null ||
    ((typeof value === 'string' || Array.isArray(value)) && value.length === 0)
  );
}
