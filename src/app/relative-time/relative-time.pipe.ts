import { Pipe, PipeTransform } from '@angular/core';

const millisecondsToDay = 1000*60*60*24;

const rtf = new (Intl as any).RelativeTimeFormat('en');

@Pipe({
  name: 'relativeTime'
})
export class RelativeTimePipe implements PipeTransform {

  transform(utcTime: string): string{
    const diffInMilliseconds = new Date(utcTime).getTime() - new Date().getTime();
    const diffInDays = Math.round(diffInMilliseconds/millisecondsToDay);
    const diffInYears = Math.round(diffInDays/365);
    return diffInDays < -365 ? rtf.format(diffInYears, 'year') : rtf.format(diffInDays, 'day');
  }

}
