import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import {
  TpAdminClient, TpOtherClient, TpUserClient, TpProfileClient,
  TpPunchClient, TpPuClient, API_BASE_URL
} from './services/client-proxy';
import { TpClientConfig } from './timepuncher-client-config';
import { PunchService, BUILD_INFO } from './services/puncher/punch.service';
import { AuthGuard } from './services/auth/auth.guard';
import { AuthService } from './services/auth/auth.service';
import { AlertService } from './services/alert/alert.service';
import { AlertDirective } from './directives/alert/alert.directive';
import { AppRoutingModule } from './app.routing';
import { MainRoutingModule } from './pages/main.rounting.module';
import { CoreModule } from '../app/core/core.module';
import { SharedModule } from '../app/shared/shared.module';
import { AppComponent } from './app.component';
import { DialogComponent } from './dialog/dialog.component';
import { PunchEditComponent } from './dialog/punchedit.component';
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { SysadminComponent } from './pages/sysadmin/sysadmin.component';
import { TimeadminComponent } from './pages/timeadmin/timeadmin.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LogoutComponent } from './pages/logout/logout.component';

export function jwtOptionsFactory(tokenService) {
  return {
    tokenGetter: () => {
      return tokenService.getToken();
    },
    whitelistedDomains: ['localhost:5000', 'api.timepuncher.ch']
  }
}

@NgModule({
  declarations: [
    AppComponent,
    DialogComponent,
    PunchEditComponent,
    LoginComponent,
    RegistrationComponent,
    AlertDirective,
    MainComponent,
    OverviewComponent,
    ProfileComponent,
    LogoutComponent,
    SysadminComponent,
    TimeadminComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    SharedModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    MainRoutingModule,
    AppRoutingModule,
    IonicStorageModule.forRoot({
      name: '__tpmaterial',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [AuthService]
      }
    })],
  providers: [
    AuthGuard,
    TpAdminClient,
    TpOtherClient,
    TpUserClient,
    TpProfileClient,
    TpPuClient,
    TpPunchClient,
    AlertService,
    PunchService,
    AuthService,
    {
      provide: API_BASE_URL,
      useValue: TpClientConfig.baserurl
    },
    {
      provide: BUILD_INFO,
      useValue: TpClientConfig.bts
    },
  ],
  entryComponents: [DialogComponent, PunchEditComponent],
  bootstrap: [AppComponent],
  exports: [
  ]
})
export class AppModule { }