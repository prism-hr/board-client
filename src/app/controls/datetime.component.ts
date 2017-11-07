import {Component, ElementRef, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import * as moment from 'moment';
import {Utils} from '../services/utils';

@Component({
  selector: 'b-datetime',
  template: `
    <label>Specify date / time</label>
    <p-calendar class="calendar-item" [(ngModel)]="date" (ngModelChange)="dateTimeChanged()" dateFormat="yy-mm-dd"
                dataType="string" [yearNavigator]="true" [monthNavigator]="true" [yearRange]="yearRange"
                (onBlur)="touched()" [disabled]="isDisabled"></p-calendar>
    <p-inputMask class="time-item" [(ngModel)]="time" (ngModelChange)="dateTimeChanged()"
                 (onBlur)="touched()" [disabled]="isDisabled" mask="99:99"></p-inputMask>
  `,
  styles: [`
    label {
      display: block
    }

    .calendar-item, .time-item {
      display: inline-block;
    }

    .time-item {
      width: 64px
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimeComponent),
      multi: true
    }
  ]
})
export class DateTimeComponent implements ControlValueAccessor, OnInit {

  date: string;
  time: string;
  propagateChange: any;
  propagateTouch: any;
  selectedTz: string;
  mainTz = 'Europe/London';
  isDisabled: boolean;
  yearRange = Utils.getYearRange();

  constructor(public elementRef: ElementRef) {
  }

  ngOnInit(): void {
  }

  dateTimeChanged() {
    const iso = moment(this.date + ' ' + this.time);
    this.propagateChange(iso.isValid() ? iso.format().split('+')[0] : null);
  }

  touched() {
    this.propagateTouch();
  }

  writeValue(dateTime: string): void {
    if (dateTime) {
      const localDatetime = moment(dateTime);
      const selectedDateTime = localDatetime.format();
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
