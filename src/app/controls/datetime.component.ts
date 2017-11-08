import {Component, forwardRef, NgModule, OnInit} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {CalendarModule, InputMaskModule} from 'primeng/primeng';
import {SharedModule} from '../general/shared.module';
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

  constructor() {
  }

  ngOnInit(): void {
  }

  dateTimeChanged() {
    const dateString = this.date + 'T' + this.time;
    const date = new Date(dateString);
    this.propagateChange(isNaN(date.getTime()) ? null : dateString);
  }

  touched() {
    this.propagateTouch();
  }

  writeValue(dateTime: string): void {
    if (dateTime) {
      [this.date, this.time] = dateTime.split('T');
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

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    CalendarModule,
    InputMaskModule
  ],
  declarations: [
    DateTimeComponent
  ],
  exports: [
    DateTimeComponent
  ]
})
export class DateTimeModule {
}
