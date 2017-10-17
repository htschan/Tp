import { Component, OnInit } from '@angular/core';
import { MatIconRegistry, MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService, RoleEnum } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sysadmin',
  templateUrl: './sysadmin.component.html',
  styleUrls: ['./sysadmin.component.css']
})
export class SysadminComponent implements OnInit {
  hasRequiredRole: boolean;

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private dialog: MatDialog, private authService: AuthService) { }

  ngOnInit() {
    this.authService.hasRole(RoleEnum.AdminRole).then(hasRole => this.hasRequiredRole = hasRole);
  }

}
