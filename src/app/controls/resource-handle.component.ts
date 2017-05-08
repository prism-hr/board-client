import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'b-resource-handle',
  template: `
    <span>{{urlPrefix}}</span>
    <input pInputText [(ngModel)]="handle" (change)="handleChanged($event)" required>
    <button pButton type="button" (click)="copyToClipboard()" icon="fa-docs"></button>
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

  constructor() {
  }

  handleChanged() {
    this.propagateChange(this.handle);
  }

  copyToClipboard() {

  }

  writeValue(handle: string): void {
    this.handle = handle;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }
}
