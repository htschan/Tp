import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { CoreModule } from '../app/core/core.module';
import { SharedModule } from '../app/shared/shared.module';

import { httpFactory } from './core/http/http.factory';
import { IonicStorageModule } from '@ionic/storage';
import { TpClientConfig } from './timepuncher-client-config';
import { AppComponent } from './app.component';
import { DialogComponent } from './dialog/dialog.component';
import { PunchEditComponent } from './dialog/punchedit.component';
import { AlertDirective } from './directives/alert/alert.directive';
import { AppRoutingModule } from './app.routing';
import { AuthGuard } from './core/http/auth.guard';
import { TpClient, API_BASE_URL } from './services/api.g';
import { AuthService } from './services/auth/auth.service';
import { AlertService } from './services/alert/alert.service';
import { PunchService, BUILD_INFO } from './services/puncher/punch.service';
import { MainRoutingModule } from './pages/main.rounting.module';
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { SysadminComponent } from './pages/sysadmin/sysadmin.component';
import { TimeadminComponent } from './pages/timeadmin/timeadmin.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LogoutComponent } from './pages/logout/logout.component';

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
    MainRoutingModule,
    AppRoutingModule,
    IonicStorageModule.forRoot({
      name: '__tpmaterial',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  providers: [
    AuthGuard,
    TpClient,
    AlertService,
    PunchService,
    AuthService,
    {
      provide: API_BASE_URL,
      useValue: TpClientConfig.baserurl
    },
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, API_BASE_URL, Storage]
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