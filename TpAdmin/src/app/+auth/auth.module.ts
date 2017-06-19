import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { SmartadminModule } from '../shared/smartadmin.module';
import { LoginComponent } from './login/login.component';
import { LockedComponent } from './locked/locked.component';
import { RegisterComponent } from './register/register.component';
import { ForgotComponent } from './forgot/forgot.component';
import { routing } from './auth.routing';
import { AuthComponent } from './auth.component';

@NgModule({
  imports: [
    routing,
    SmartadminModule
  ],
  declarations: [
    LoginComponent,
    LockedComponent,
    RegisterComponent,
    ForgotComponent,
    AuthComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthModule { }
