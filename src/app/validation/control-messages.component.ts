import {Component, Input} from '@angular/core';
import {AbstractControl, FormControl} from '@angular/forms';
import {ValidationService} from './validation.service';

@Component({
  selector: 'control-messages',
  template: `
    <div *ngIf="errorMessage()" class="ui-message ui-messages-error ui-corner-all">
      <i class="fa fa-close"></i>
      {{errorMessage()}}
    </div>
  `
})
export class ControlMessagesComponent {

  @Input() control: FormControl;

  errorMessage() {
    let control: AbstractControl = this.control;
    while (control.parent) {
      control = control.parent;
    }
    const form = control as FormControl;
    for (const propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && (this.control.touched || form['submitted'])) {
        return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }
    return null;
  }
}
