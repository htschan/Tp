import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { AuthGuard } from './core/http/auth.guard';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegistrationComponent },

    // otherwise redirect to overview
    { path: '**', redirectTo: 'main/overview' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, { enableTracing: false }) // <-- debugging purposes only
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }