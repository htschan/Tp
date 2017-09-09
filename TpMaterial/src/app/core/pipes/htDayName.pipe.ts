import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'htDayName'
})
export class HtDayNamePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    return dayNames[value];
  }

}
