import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from "./shared/layout/app-layouts/main-layout.component";
import { AuthLayoutComponent } from "./shared/layout/app-layouts/auth-layout.component";
import { AuthService } from './shared/services/auth.service';

export const routes: Routes = [
    {
        path: '', component: MainLayoutComponent, canActivate: [AuthService], children: [
            { path: 'home', loadChildren: 'app/home/home.module#HomeModule', data: { pageTitle: 'Home' }, canActivate: [AuthService] },
            { path: 'todos', loadChildren: 'app/todos/todos.module#TodosModule', data: { pageTitle: 'Todos', roles: ['user'] }, canActivate: [AuthService] },
            { path: 'groups', loadChildren: 'app/+groups/groups.module#GroupsModule', data: { pageTitle: 'Groups' }, canActivate: [AuthService] },
            { path: 'timepuncher', loadChildren: 'app/+timepuncher/timepuncher.module#TimepuncherModule', data: { pageTitle: 'Timepuncher', roles: ['admin'] }, canActivate: [AuthService] },
            { path: 'administration', loadChildren: 'app/+administration/admin.module#AdministrationModule', data: { pageTitle: 'Administration', roles: ['admin'] }, canActivate: [AuthService] },
        ]
    },
    { path: 'auth', component: AuthLayoutComponent, loadChildren: 'app/+auth/auth.module#AuthModule' },
    { path: '**', redirectTo: 'home', canActivate: [AuthService] }

];

export const routing = RouterModule.forRoot(routes);

