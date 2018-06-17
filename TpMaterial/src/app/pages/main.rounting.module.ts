import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../services/auth/auth.guard';
import { MainComponent } from './main/main.component';
import { OverviewComponent } from './overview/overview.component';
import { ProfileComponent } from './profile/profile.component';
import { LogoutComponent } from './logout/logout.component';
import { SysadminComponent } from './sysadmin/sysadmin.component';
import { TimeadminComponent } from './timeadmin/timeadmin.component';

const mainRoutes: Routes = [
    {
        path: 'main', component: MainComponent, canActivate: [AuthGuard],
        children: [
            { path: 'overview', component: OverviewComponent, canActivate: [AuthGuard] },
            { path: 'timeadmin', component: TimeadminComponent, canActivate: [AuthGuard] },
            { path: 'sysadmin', component: SysadminComponent, canActivate: [AuthGuard] },
            { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
            { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
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