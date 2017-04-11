import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
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
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }
    return null;
  }
}
