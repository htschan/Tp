import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { routing } from './timepuncher.routing';
import { SmartadminModule } from "../shared/smartadmin.module";
import { TimepuncherComponent } from "./timepuncher.component";
import { UsermonthComponent } from './usermonth/usermonth.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { PunchComponent } from './punch/punch.component';
import { PunchdayComponent } from './punchday/punchday.component';

@NgModule({
  imports: [
    routing,
    SmartadminModule,
    InputsModule
  ],
  declarations: [
    TimepuncherComponent,
    UsermonthComponent,
    PunchComponent,
    PunchdayComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimepuncherModule { }
