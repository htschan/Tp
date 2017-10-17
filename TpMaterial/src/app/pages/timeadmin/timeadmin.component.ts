import { Component, OnInit } from '@angular/core';
import { MatIconRegistry, MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import { PunchService, PunchMonthVm } from '../../services/puncher/punch.service';
import { AuthService, UsersVm, RoleEnum } from '../../services/auth/auth.service';
import { HtMonthNamePipe } from '../../core/pipes/htmonthname.pipe';
import { StatusAdminDtoStatus, StatusAdminDto } from '../../services/api.g';

@Component({
  selector: 'app-timeadmin',
  templateUrl: './timeadmin.component.html',
  styleUrls: ['./timeadmin.component.css']
})
export class TimeadminComponent implements OnInit {

  usersVm: UsersVm;
  selectedUserId: string;
  hasRequiredRole: boolean;
  punchMonthVm: PunchMonthVm;
  years = [];
  months = [];
  year;
  month;
  monthState: StatusAdminDtoStatus = StatusAdminDtoStatus.Open;

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private dialog: MatDialog, private punchService: PunchService, private authService: AuthService) { }

  ngOnInit() {
    let dt = new Date();
    this.year = dt.getFullYear();
    this.month = dt.getMonth();
    let pipe = new HtMonthNamePipe();
    for (let i = 1; i < 13; i++) {
      this.months.push({ monthNum: i, monthName: pipe.transform(i) })
    }
    for (let i = 2015; i <= dt.getFullYear(); i++) {
      this.years.push(i);
    }
    this.authService.puGetUsers().take(1).subscribe(s => {
      this.usersVm = s;
      this.selectedUserId = this.usersVm.users[0].id;
      this.userChanged();
    })
    this.authService.hasRole(RoleEnum.PowerRole).then(hasRole => this.hasRequiredRole = hasRole);
  }

  userChanged() {
    this.punchService.puGetMonth(this.selectedUserId, this.month, this.year).take(1).subscribe(response =>
      this.punchMonthVm = response
    );
  }

  monthChanged() {
    this.userChanged();
  }

  stateChanged() {
    let st = new StatusAdminDto();
    st.status = this.monthState;
    st.userid = this.selectedUserId;
    this.punchService.setStatusAdmin(st);
  }
}
