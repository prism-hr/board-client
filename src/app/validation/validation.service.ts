import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;

export class ValidationService {

  static EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    const config = {
      required: 'This field is required',
      email: 'Invalid email address',
      password: 'Invalid password. Password must be at least 6 characters long and contain a number.',
      minlength: `Minimum length ${validatorValue.requiredLength}`,
      maxlength: `Maximum length ${validatorValue.requiredLength}`,
      duplicateHandle: 'The alias is already taken.',
      duplicateDepartment: 'Another department with this name already exists.',
      duplicateBoard: 'Another board with this name already exists.',
      lastAdminRole: 'Cannot remove last admin role.'
    };

    return config[validatorName];
  }

  static emailValidator(control) {
    // RFC 2822 compliant regex

    if (control.value && control.value.match(ValidationService.EMAIL_REGEX)) {
      return null;
    } else {
      return {'email': true};
    }
  }

  static passwordValidator(control) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,30}$/)) {
      return null;
    } else {
      return {'password': true};
    }
  }
}
