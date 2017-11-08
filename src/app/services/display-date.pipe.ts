import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'displayDate'})
export class DisplayDatePipe implements PipeTransform {
  transform(dateString: string): string {
    const date = new Date(dateString);
    const currentDate = new Date();

    return DisplayDatePipe.displayDate(currentDate, date);
  }

  static displayDate(current: Date, date: Date) {
    const localDate = new Date(date);
    localDate.setMinutes(localDate.getMinutes() - date.getTimezoneOffset());

    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;

    const difference = current.getTime() - localDate.getTime();
    const absDifference = Math.abs(difference);

    if (absDifference < msPerMinute) {
      const value = Math.round(difference / 1000);
      if (difference > 0) {
        return value + ' seconds ago';
      }
    }

    else if (absDifference < msPerHour) {
      const value = Math.round(difference / msPerMinute);
      if (difference > 0) {
        return value + ' minutes ago';
      }
    }

    else if (absDifference < msPerDay) {
      const value = Math.round(difference / msPerHour);
      if (difference > 0) {
        return value + ' hours ago';
      }
    }

    else if (absDifference < msPerMonth) {
      const value = Math.round(difference / msPerDay);
      if (Math.abs(value) < 5) {
        if (difference > 0) {
          return value + ' day(s) ago';
        }
      }
    }

    return date.toLocaleString();
  }

}
