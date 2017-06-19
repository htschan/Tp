import { NgModule } from '@angular/core';
import { routing } from './groups.routing';
import { SmartadminModule } from "../shared/smartadmin.module";
import { GroupsComponent } from "./groups.component";

@NgModule({
  imports: [
    routing,
    SmartadminModule
  ],
  declarations: [GroupsComponent]
})
export class GroupsModule { }
