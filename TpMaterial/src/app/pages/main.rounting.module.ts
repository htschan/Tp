import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../http/auth.guard';
import { MainComponent } from './main/main.component';
import { OverviewComponent } from './overview/overview.component';
import { ProfileComponent } from './profile/profile.component';
import { LogoutComponent } from './logout/logout.component';

const mainRoutes: Routes = [
    {
        path: 'main', component: MainComponent, canActivate: [AuthGuard],
        children: [
            { path: 'overview', component: OverviewComponent,/* canActivate: [AuthGuard] */ },
            { path: 'profile', component: ProfileComponent,/* canActivate: [AuthGuard] */ },
            { path: 'logout', component: LogoutComponent,/* canActivate: [AuthGuard] */ },
            { path: '**', redirectTo: 'main/overview' }            
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(mainRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class MainRoutingModule { }