import {AbstractControl, ValidatorFn} from '@angular/forms';

export class ValidationUtils {

  static EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  static URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    const config = {
      required: 'This field is required',
      email: 'Invalid email address',
      password: 'Invalid password. Password must be at least 6 characters long and contain a number.',
      repeatPassword: 'You have to re-type your new password again.',
      minlength: `Minimum length ${validatorValue.requiredLength}`,
      maxlength: `Maximum length ${validatorValue.requiredLength}`,
      duplicateHandle: 'The alias is already taken.',
      duplicateDepartment: 'Another department with this name already exists.',
      duplicateBoard: 'Another board with this name already exists.',
      lastAdminRole: 'Cannot remove last admin role.',
      resume: 'You need to upload a document or specify a website containing your CV.'
    };

    return config[validatorName] || 'Form validation error';
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
}
