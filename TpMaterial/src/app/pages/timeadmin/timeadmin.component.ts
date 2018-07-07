import { Component, OnInit } from '@angular/core';
import { MatIconRegistry, MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import { PunchService, PunchMonthVm, PunchYearVm } from '../../services/puncher/punch.service';
import { AuthService, UsersVm, RoleEnum } from '../../services/auth/auth.service';
import { HtMonthNamePipe } from '../../core/pipes/htmonthname.pipe';
import { StatusAdminDtoStatus, StatusAdminDto } from '../../services/client-proxy';

@Component({
  selector: 'app-timeadmin',
  templateUrl: './timeadmin.component.html',
  styleUrls: ['./timeadmin.component.css']
})
export class TimeadminComponent implements OnInit {

  viewYear: boolean;
  usersVm: UsersVm;
  selectedUserId: string;
  hasRequiredRole: boolean;
  punchMonthVm: PunchMonthVm;
  punchYearVm: PunchYearVm;
  years = [];
  months = [];
  year;
  month;
  monthState: StatusAdminDtoStatus = StatusAdminDtoStatus.Open;

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private dialog: MatDialog,
    private punchService: PunchService, private authService: AuthService) { }

  ngOnInit() {
    const dt = new Date();
    this.year = dt.getFullYear();
    this.month = dt.getMonth();
    const pipe = new HtMonthNamePipe();
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
    });
    this.authService.hasRole(RoleEnum.PowerRole).then(hasRole => this.hasRequiredRole = hasRole);
  }

  userChanged() {
    this.punchService.puGetMonth(this.selectedUserId, this.month, this.year).take(1).subscribe(response => {
      this.punchMonthVm = response;
      this.monthState = response.state.status;
    });
  }

  monthChanged() {
    this.userChanged();
  }

  checkYearChanged() {

  }

  stateChanged() {
    const st = new StatusAdminDto();
    st.status = this.monthState;
    st.userid = this.selectedUserId;
    st.month = this.month;
    st.year = this.year;
    this.punchService.setStatusAdmin(st).take(1).subscribe(response =>
      console.log('response'));
  }
}
