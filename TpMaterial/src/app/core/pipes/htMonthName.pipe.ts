import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'htMonthName'
})
export class HtMonthNamePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    return monthNames[value - 1];
  }
}
