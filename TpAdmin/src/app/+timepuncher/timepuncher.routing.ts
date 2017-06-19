import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimepuncherComponent } from "./timepuncher.component";
import { UsermonthComponent } from "./usermonth/usermonth.component";

export const routes: Routes = [
    {
        path: '',
        component: TimepuncherComponent,
        data: {
            pageTitle: 'Timepuncher'
        },
    },
    {
        path: 'um/:userid',
        component: UsermonthComponent,
        data: {
            pageTitle: 'User Month'
        }
    }
];

export const routing = RouterModule.forChild(routes);

