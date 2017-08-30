import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Storage } from '@ionic/storage';
import 'hammerjs';
import {
  MdAutocompleteModule,
  MdButtonModule,
  MdButtonToggleModule,
  MdCardModule,
  MdCheckboxModule,
  MdChipsModule,
  MdCoreModule,
  MdTableModule,
  MdDatepickerModule,
  MdDialogModule,
  MdExpansionModule,
  // MdFormFieldModule, 
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdNativeDateModule,
  MdPaginatorModule,
  MdProgressBarModule,
  MdProgressSpinnerModule,
  MdRadioModule,
  MdRippleModule,
  MdSelectModule,
  MdSidenavModule,
  MdSliderModule,
  MdSlideToggleModule,
  MdSnackBarModule,
  MdSortModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule,
  StyleModule
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk';
import { httpFactory } from './http/http.factory';
import { IonicStorageModule } from '@ionic/storage';
import { TpClientConfig } from './timepuncher-client-config';
import { AppComponent } from './app.component';
import { DialogComponent } from './dialog/dialog.component';
import { PunchEditComponent } from './dialog/punchedit.component';
import { AlertDirective } from './directives/alert/alert.directive';
import { AppRoutingModule } from './app.routing';
import { AuthGuard } from './http/auth.guard';
import { TpClient, API_BASE_URL } from './services/api.g';
import { AuthService } from './services/auth/auth.service';
import { AlertService } from './services/alert/alert.service';
import { PunchService } from './services/puncher/punch.service';
import { MainRoutingModule } from './pages/main.rounting.module';
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { MonthNamePipe } from './pipes/monthname.pipe';
import { DayNamePipe } from './pipes/day-name.pipe';

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
    MonthNamePipe,
    DayNamePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdCheckboxModule,
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
  ],
  entryComponents: [DialogComponent, PunchEditComponent],
  bootstrap: [AppComponent],
  exports: [
    MdAutocompleteModule,
    MdButtonModule,
    MdButtonToggleModule,
    MdCardModule,
    MdCheckboxModule,
    MdChipsModule,
    MdTableModule,
    MdDatepickerModule,
    MdDialogModule,
    MdExpansionModule,
    // MdFormFieldModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdCoreModule,
    MdPaginatorModule,
    MdProgressBarModule,
    MdProgressSpinnerModule,
    MdRadioModule,
    MdRippleModule,
    MdSelectModule,
    MdSidenavModule,
    MdSlideToggleModule,
    MdSliderModule,
    MdSnackBarModule,
    MdSortModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
    MdNativeDateModule,
    CdkTableModule,
    StyleModule
  ]
})
export class AppModule { }