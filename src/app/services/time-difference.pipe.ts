import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'timeDifference'})
export class TimeDifferencePipe implements PipeTransform {
  transform(dateString: string): number {
    const date = new Date(dateString.replace('T', ' ') + ' GMT');
    const currentDate = new Date();
    return date.getTime() - currentDate.getTime();
  }

}
