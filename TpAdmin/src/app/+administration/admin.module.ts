import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { SmartadminModule } from '../shared/smartadmin.module';
import { routing } from './admin.routing';
import { UsersComponent } from './users/users.component';
import { AdministrationComponent } from './admin.component';

@NgModule({
  imports: [
    routing,
    SmartadminModule
  ],
  declarations: [
    UsersComponent,
    AdministrationComponent,
    UsersComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdministrationModule { }
