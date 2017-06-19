import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupsComponent } from "./groups.component";

export const routes: Routes = [
    {
        path: '',
        component: GroupsComponent,
        data: {
            pageTitle: 'Groups'
        }
    }
];

export const routing = RouterModule.forChild(routes);

