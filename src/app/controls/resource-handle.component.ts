import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'b-resource-handle',
  template: `
    <div class="grid">
      <div class="grid__item one-whole host-url">
        <span>{{urlPrefix}}</span>
        <span class="host-url__input">
          <input pInputText [(ngModel)]="handle" (change)="handleChanged($event)" required>
        </span>
        <span class="host-url__button">
          <button pButton type="button" ngxClipboard [cbContent]="fullUrl" class="ui-button-success" icon="fa-docs"></button>
        </span>
      </div>
    </div>
  `,
  styleUrls: ['xeditable.scss'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ResourceHandleComponent), multi: true}
  ]
})
export class ResourceHandleComponent implements ControlValueAccessor {
  @Input() urlPrefix: string;

  propagateChange: any;
  handle: string;
  fullUrl: string;

  constructor() {
  }

  handleChanged() {
    this.propagateChange(this.handle);
    this.fullUrl = this.urlPrefix + this.handle;
  }

  writeValue(handle: string): void {
    this.handle = handle;
    this.fullUrl = this.urlPrefix + this.handle;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }
}
