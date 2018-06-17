import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

import { TpClient, API_BASE_URL } from '../services/api.g';
import { TpClientConfig } from '../timepuncher-client-config';
import { PunchService, BUILD_INFO } from '../services/puncher/punch.service';
import { AuthService } from '../services/auth/auth.service';
import { PunchEditModal } from '../pages/punchedit/punchedit';
import { SampleService } from '../services/sample.service';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from '../pages/profile/profile';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { MonthNamePipe } from '../pipes/monthName.pipe';
import { DayNamePipe } from '../pipes/dayName.pipe';

export function jwtOptionsFactory(tokenService) {
  return {
    tokenGetter: () => {
      return tokenService.getToken();
    },
    whitelistedDomains: ['localhost:5000','api.timepuncher.ch']
  }
}

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    PunchEditModal,
    TabsPage,
    ProfilePage,
    LoginPage,
    RegisterPage,
    MonthNamePipe,
    DayNamePipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp, {}, {
      links: [
        { component: TabsPage, name: 'TabsPage', segment: 'tabs-page' },
        { component: HomePage, name: 'Home', segment: 'home' },
        { component: PunchEditModal, name: 'PunchEditModal', segment: 'puncheditmodal' },
        { component: ProfilePage, name: 'Profile', segment: 'profile' },
        { component: AboutPage, name: 'About', segment: 'about' },
        { component: ContactPage, name: 'Contace', segment: 'contact' },
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
        { component: RegisterPage, name: 'SignupPage', segment: 'signup' }
      ]
    }),
    IonicStorageModule.forRoot({
      name: '__tpionic',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [AuthService]
      }
    })],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    PunchEditModal,
    TabsPage,
    ProfilePage,
    LoginPage,
    RegisterPage
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    {
      provide: API_BASE_URL,
      useValue: TpClientConfig.baserurl
    },
    {
      provide: BUILD_INFO,
      useValue: TpClientConfig.bts
    },
    TpClient,
    AuthService,
    PunchService,
    SampleService
  ]
})
export class AppModule { }
