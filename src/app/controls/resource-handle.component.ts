import {Component, forwardRef, Input, NgModule} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {SharedModule} from '../general/shared.module';
import {ClipboardModule} from 'ngx-clipboard/dist';
import {ButtonModule} from 'primeng/primeng';

@Component({
  selector: 'b-resource-handle',
  template: `
    <div class="grid">
      <div class="grid__item one-whole host-url">
        <span>{{urlPrefix}}</span>
        <span class="host-url__input">
          <input pInputText [(ngModel)]="handle" (ngModelChange)="handleChanged()" (blur)="touched()" required>
        </span>
        <span class="host-url__button">
          <button pButton type="button" ngxClipboard [cbContent]="fullUrl" class="ui-button-success" icon="fa-docs"
                  (cbOnSuccess)="copySuccess()"></button>
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
  propagateTouch: any;
  handle: string;
  fullUrl: string;

  constructor(private snackBar: MatSnackBar) {
  }

  handleChanged() {
    this.propagateChange(this.handle);
    this.fullUrl = this.urlPrefix + this.handle;
  }

  touched() {
    this.propagateTouch();
  }

  copySuccess() {
    this.snackBar.open('URL copied!', null, {duration: 1500});
  }

  writeValue(handle: string): void {
    this.handle = handle;
    this.fullUrl = this.urlPrefix + this.handle;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }
}

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ClipboardModule,
    ButtonModule
  ],
  declarations: [
    ResourceHandleComponent
  ],
  exports: [
    ResourceHandleComponent
  ]
})
export class ResourceHandleModule {
}
