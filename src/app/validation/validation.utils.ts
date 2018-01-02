import {AbstractControl, FormArray, ValidatorFn} from '@angular/forms';

export class ValidationUtils {

  static EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  static URL_REGEX = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  static HANDLE_REGEX = /^[a-z0-9-]+$/;

  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    const config = {
      required: 'This field is required',
      email: 'Invalid email address',
      password: 'Invalid password. Password must be at least 8 characters long and contain a number.',
      repeatPassword: 'Passwords did not match, please retype.',
      minlength: `Minimum length ${validatorValue.requiredLength}`,
      maxlength: `Maximum length ${validatorValue.requiredLength}`,
      duplicateHandle: 'The alias is already taken.',
      duplicateDepartment: 'Another department with this name already exists.',
      duplicateBoard: 'Another board with this name already exists.',
      lastAdminRole: 'Cannot remove last admin role.',
      resume: 'You need to upload a document or specify a website containing your CV.',
      checkboxArrayMin: 'You have to select a value.',
      fakeCategory: 'You cannot leave example categories.',
      url: 'Incorrect URL format.',
      handle: 'You can only use letters, digits and \'-\' character.'
    };

    if (config[validatorName]) {
      return config[validatorName];
    } else {
      console.log('Missing validation text for: ' + validatorName);
      return 'Form validation error';
    }
  }

  static emailValidator(control: AbstractControl) {
    // RFC 2822 compliant regex

    const isSpecified = control.value && control.value !== '';
    if (!isSpecified || control.value.match(ValidationUtils.EMAIL_REGEX)) {
      return null;
    } else {
      return {email: true};
    }
  }

  static urlValidator(control: AbstractControl) {
    const isSpecified = control.value && control.value !== '';
    if (!isSpecified || control.value.match(ValidationUtils.URL_REGEX)) {
      return null;
    } else {
      return {url: true};
    }
  }

  static handleValidator(control: AbstractControl) {
    const isSpecified = control.value && control.value !== '';
    if (!isSpecified || control.value.match(ValidationUtils.HANDLE_REGEX)) {
      return null;
    } else {
      return {handle: true};
    }
  }

  static passwordValidator(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,30}$/)) {
      return null;
    } else {
      return {password: true};
    }
  }

  static repeatPasswordValidator(password: string): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value !== password) {
        return {repeatPassword: true};
      }
    };
  }

  static checkboxArrayMin(min: number): ValidatorFn {
    return (control: FormArray) => {
      const array: boolean[] = control.value;
      if (array.filter(v => v).length < min) {
        return {checkboxArrayMin: true}
      }
    };
  }
}
