
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HtMonthNamePipe } from './pipes/htmonthname.pipe';
import { HtDayNamePipe } from './pipes/htdayname.pipe';
import { HtWeekNumPipe } from './pipes/htweeknum.pipe';

@NgModule({
    declarations: [
        HtMonthNamePipe,
        HtDayNamePipe,
        HtWeekNumPipe
    ],
    imports: [
        BrowserAnimationsModule
    ],
    exports: [
        HtMonthNamePipe,
        HtDayNamePipe,
        HtWeekNumPipe
    ]
})
export class CoreModule { }