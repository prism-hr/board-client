import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {DefinitionsService} from '../services/definitions.service';
import {ControlValueAccessor, FormGroupName, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'b-resource-handle',
  template: `
    <span>{{urlPrefix}}</span>
    <span *ngIf="!editing" (click)="edit()"><span>{{handle}}</span>
    </span>
    <span *ngIf="editing">
      <input pInputText [(ngModel)]="editedHandle" required>
      <button pButton type="button" class="ui-button-success ui-button-small" (click)="ok()" icon="fa-check"></button>
      <button pButton type="button" class="ui-button-warning ui-button-small" (click)="cancel()" icon="fa-close"></button>
    </span>
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
  editedHandle: string;
  editing: boolean;

  constructor() {
  }

  edit() {
    this.editing = true;
    this.editedHandle = this.handle;
  }

  cancel() {
    this.editing = false;
  }

  ok() {
    this.handle = this.editedHandle;
    this.editing = false;
    this.propagateChange(this.handle);
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
