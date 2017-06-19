import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Http, RequestOptions } from '@angular/http';
import { provideAuth, AuthHttp, AuthConfig } from 'angular2-jwt';

import { SmartadminModule } from './shared/smartadmin.module'
import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { FloatingActionService } from './shared/services/floating.action.service';
import { AuthService } from './shared/services/auth.service';
// import { NgxDatatableModule } from '@swimlane/ngx-datatable';

export function getAuthHttp(http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    headerName: 'x-access-token',
    noTokenScheme: true,
    noJwtError: true,
    globalHeaders: [{ 'Accept': 'application/json' }],
    tokenGetter: (() => localStorage.getItem('id_token')),
  }), http, options);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    routing,
    MaterialModule,
    ReactiveFormsModule,
    SmartadminModule.forRoot(),
    FlexLayoutModule,
    // NgxDatatableModule
  ],
  exports: [
    FlexLayoutModule,
    HttpModule
  ],
  providers: [
    // must be provided here at the top level module, otherwise multiple instances may be instantiated, see README.md
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http, RequestOptions]
    },
    FloatingActionService,
    AuthService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
