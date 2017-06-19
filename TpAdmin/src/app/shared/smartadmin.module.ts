import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { JsonApiService } from './api'
import { TinyMceModule } from "./tinymce/tinymce.module";
import { I18nModule } from './i18n/i18n.module';

import { TodoService } from './services/todo.service';
import { ProductService } from './services/product.service';
import { ReceiptService } from './services/receipt.service';
import { ProfileService } from './services/profile.service';
import { GroupService } from './services/group.service';
import { AdminService } from './services/admin.service';
import { TimepuncherService } from './services/timepuncher.service';

import { MainLayoutComponent } from './layout/app-layouts/main-layout.component';
import { AuthLayoutComponent } from './layout/app-layouts/auth-layout.component';
import { HtmlViewComponent, SafePipe } from './htmlview/htmlview.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    RouterModule,
    TinyMceModule,
    I18nModule
  ],
  declarations: [
    MainLayoutComponent,
    AuthLayoutComponent,
    HtmlViewComponent,
    SafePipe,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    TinyMceModule,
    HtmlViewComponent,
  ],
  providers: [
    JsonApiService,
    TodoService,
    ProductService,
    ReceiptService,
    ProfileService,
    GroupService,
    AdminService,
    TimepuncherService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SmartadminModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SmartadminModule,
      providers: [
        JsonApiService,
      ]
    };
  }
}
