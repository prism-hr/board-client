import {Component, ElementRef, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import * as moment from 'moment';
import 'moment-timezone';

@Component({
  selector: 'b-datetime',
  template: `
    <p-calendar [(ngModel)]="date" (ngModelChange)="dateTimeChanged($event)" dateFormat="yy-mm-dd"
                dataType="string" (onBlur)="touched()" [disabled]="isDisabled"></p-calendar>
    <p-calendar [(ngModel)]="time" (ngModelChange)="dateTimeChanged($event)" [timeOnly]="true"
                dataType="string" [stepMinute]="5" (onBlur)="touched()" [disabled]="isDisabled"></p-calendar>
    <div *ngIf="currentTz !== mainTz" class="ui-radiobutton-inline">
      <p-radioButton [name]="timezoneRadioGroupName" [value]="mainTz" [label]="mainTz" [(ngModel)]="selectedTz"
                     (ngModelChange)="dateTimeChanged($event)" [disabled]="isDisabled"></p-radioButton>
      <p-radioButton [name]="timezoneRadioGroupName" [value]="currentTz" [label]="currentTz" [(ngModel)]="selectedTz"
                     (ngModelChange)="dateTimeChanged($event)" [disabled]="isDisabled"></p-radioButton>
    </div>
  `,
  styles: [''],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimeComponent),
      multi: true
    }
  ]
})
export class DateTimeComponent implements ControlValueAccessor, OnInit {

  timezoneRadioGroupName: string;
  date: string;
  time: string;
  propagateChange: any;
  propagateTouch: any;
  currentTz: string;
  selectedTz: string;
  mainTz = 'Europe/London';
  isDisabled: boolean;

  constructor(public elementRef: ElementRef) {
    const nameAttr = elementRef.nativeElement.getAttribute('name');
    if (!nameAttr) {
      throw new Error('Missing name attribute for b-datetime component');
    }
    this.timezoneRadioGroupName = nameAttr + 'Timezone';
  }

  ngOnInit(): void {
    this.currentTz = (moment as any).tz.guess();
    this.selectedTz = this.currentTz;
  }

  dateTimeChanged() {
    const iso = (moment as any).tz(this.date + ' ' + this.time, this.selectedTz).tz(this.currentTz);
    this.propagateChange(iso.format().slice(0, -6));
  }

  touched() {
    this.propagateTouch();
  }

  writeValue(dateTime: string): void {
    if (dateTime) {
      const localDatetime = moment(dateTime);
      const selectedDateTime = (localDatetime as any).tz(this.selectedTz).format();
      [this.date, this.time] = selectedDateTime.split('T');
      this.time = this.time.substr(0, 5);
    } else {
      [this.date, this.time] = [null, null];
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }

}
