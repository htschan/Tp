import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { I18nPipe } from '../../../shared/i18n/i18n.pipe';
import { AuthService } from '../../services/auth.service';
import { FloatingActionService } from '../../services/floating.action.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {
  isDarkTheme: boolean = false;

  constructor(private router: Router,
    private authService: AuthService,
    private fabService: FloatingActionService,
    private adminService: AdminService) {
  }

  logout() {
    this.authService.logout();
    {
      this.router.navigate(['/auth/login'])
    };
  }

  login() {
    this.authService.login("user","password");
  }

  fab1Clicked() {
    this.fabService.fab1Clicked();
  }

  get fab1Show() {
    return this.fabService.fab1Show;
  }

  get fab1Icon() {
    return this.fabService.fab1Icon;
  }
}
