import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { TpClientConfig } from '../timepuncher-client-config';
import { TpClient, API_BASE_URL } from '../services/api.g';
import { AuthService } from '../services/auth/auth.service';
import { PunchService } from '../services/puncher/punch.service';
import { SampleService } from '../services/sample.service';
import { Http, XHRBackend, RequestOptions } from '@angular/http';
import { httpFactory } from '../http/http.factory';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { PunchEditModal } from '../pages/punchedit/punchedit';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from '../pages/profile/profile';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';


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
    RegisterPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
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
    })
  ],
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
    TpClient,
    AuthService,
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, API_BASE_URL]
    },
    PunchService,
    SampleService
  ]
})
export class AppModule { }
