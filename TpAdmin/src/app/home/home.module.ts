import { NgModule } from '@angular/core';
import { routing } from './home.routing';
import { SmartadminModule } from "../shared/smartadmin.module";
import { HomeComponent } from "./home.component";

@NgModule({
  imports: [
    routing,
    SmartadminModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
