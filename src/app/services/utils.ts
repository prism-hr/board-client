import {AbstractControl, FormGroup} from '@angular/forms';

export class Utils {

  static checkboxToFormFormat<T>(availableValues: T[], currentValues: T[]) {
    return availableValues.map(c => currentValues ? currentValues.includes(c) : false)
  }

  static checkboxFromFormFormat<T>(availableValues: T[], currentValues: boolean[]) {
    return currentValues
      .map((checked, i) => ([checked, i]))
      .filter(([checked, i]: [boolean, number]) => checked)
      .map(([checked, i]: [boolean, number]) => availableValues[i])
  }

  static getYearRange() {
    const startYear = new Date().getFullYear();
    return '' + startYear + ':' + (startYear + 10);
  }

  static getFormErrors(formControl: AbstractControl, controlName?: string) {
    let errors = '';
    for (let error in formControl.errors) {
      const errorString = (controlName || 'Global') + ': ' + error;
      errors += errorString + ', ';
    }

    if (formControl instanceof FormGroup) {
      const group = formControl;
      for (let control in group.controls) {
        errors += Utils.getFormErrors(group.controls[control], control);
      }
    }

    return errors;
  }
}
