import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users/users.component';

export const routes: Routes = [
  {
    path: '',
    component: UsersComponent
  },
];

export const routing = RouterModule.forChild(routes);
