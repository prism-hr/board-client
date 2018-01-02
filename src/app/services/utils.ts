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

  static pluralize(value) {

    const plural = {
      '(quiz)$': '$1zes',
      '^(ox)$': '$1en',
      '([m|l])ouse$': '$1ice',
      '(matr|vert|ind)ix|ex$': '$1ices',
      '(x|ch|ss|sh)$': '$1es',
      '([^aeiouy]|qu)y$': '$1ies',
      '(hive)$': '$1s',
      '(?:([^f])fe|([lr])f)$': '$1$2ves',
      '(shea|lea|loa|thie)f$': '$1ves',
      'sis$': 'ses',
      '([ti])um$': '$1a',
      '(tomat|potat|ech|her|vet)o$': '$1oes',
      '(bu)s$': '$1ses',
      '(alias)$': '$1es',
      '(octop)us$': '$1i',
      '(ax|test)is$': '$1es',
      '(us)$': '$1es',
      '([^s]+)$': '$1s'
    };

    const irregular = {
      'move': 'moves',
      'foot': 'feet',
      'goose': 'geese',
      'sex': 'sexes',
      'child': 'children',
      'man': 'men',
      'tooth': 'teeth',
      'person': 'people'
    };

    const uncountable = [
      'sheep',
      'fish',
      'deer',
      'moose',
      'series',
      'species',
      'money',
      'rice',
      'information',
      'equipment'
    ];

    // save some time in the case that singular and plural are the same
    if (uncountable.indexOf(value.toLowerCase()) >= 0)
      return this;

    // check for irregular forms
    for (let word in irregular) {

      const pattern = new RegExp(word + '$', 'i');
      const replace = irregular[word];
      if (pattern.test(value))
        return value.replace(pattern, replace);
    }

    const array = plural;

    // check for matches using regular expressions
    for (let reg in array) {
      const pattern = new RegExp(reg, 'i');

      if (pattern.test(value))
        return value.replace(pattern, array[reg]);
    }

    return this;
  }

  static removeURLParameter(url, parameter) {
    //prefer to use l.search if you have a location/link object
    const urlparts = url.split('?');
    if (urlparts.length >= 2) {

      const prefix = encodeURIComponent(parameter) + '=';
      const pars = urlparts[1].split(/[&;]/g);

      //reverse iteration as may be destructive
      for (let i = pars.length; i-- > 0;) {
        //idiom for string.startsWith
        if (pars[i].lastIndexOf(prefix, 0) !== -1) {
          pars.splice(i, 1);
        }
      }

      url = urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
      return url;
    } else {
      return url;
    }
  }

}
