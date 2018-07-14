import { Pipe, PipeTransform } from '@angular/core';
import { getISOWeek, parse } from 'date-fns';

@Pipe({
    name: 'htWeekNum'
})
export class HtWeekNumPipe implements PipeTransform {

    transform(value: Date, args?: any): number {
        return this.getWeekNumber(value);
    }

    private getWeekNumber(d: Date): number {
        return getISOWeek(d);
    }
}
