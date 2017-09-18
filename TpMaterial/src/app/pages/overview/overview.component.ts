import { Component, OnInit } from '@angular/core';
import { MdIconRegistry, MdDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MdTabChangeEvent } from '@angular/material';

import { PunchService, PunchDayVm, PunchVm, EditResultEnum, PunchWeekVm, PunchMonthVm, PunchYearVm } from '../../services/puncher/punch.service';
import { WeekPunchesDto, MonthPunchesDto, PunchDto, OpResult, YearPunchesDto } from '../../services/api.g';
import { HtMonthNamePipe } from '../../core/pipes/htmonthname.pipe';
import { HtWeekNumPipe } from '../../core/pipes/htweeknum.pipe';
import { PunchEditComponent } from '../../dialog/punchedit.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  punchDayVm: PunchDayVm;
  punchWeekVm: PunchWeekVm;
  punchMonthVm: PunchMonthVm;
  punchYearVm: PunchYearVm;
  years = [2015, 2016, 2017];
  months = [];
  year;
  month;
  week: Date;

  constructor(iconRegistry: MdIconRegistry, sanitizer: DomSanitizer, private dialog: MdDialog, private punchService: PunchService) { }

  ngOnInit() {
    this.getToday();
    let dt = new Date();
    this.year = dt.getFullYear();
    this.month = dt.getMonth();
    let pipe = new HtMonthNamePipe();
    for (let i = 1; i < 13; i++) {
      this.months.push({ monthNum: i, monthName: pipe.transform(i) })
    }
    this.week = dt;
  }

  enter() {
    this.punchService.punch('In')
      .subscribe(response => {
        this.punchDayVm = response;
      },
      error => console.log("errrrrrr"));
  }

  leave() {
    this.punchService.punch('Out')
      .subscribe(response => {
        this.punchDayVm = response;
      });
  }

  addPunch() {
    let dto = new PunchDto();
    dto.init({ time: new Date(), timedec: 0.0, direction: false, created: new Date(), punchid: "" });
    let punchVm = new PunchVm(dto);
    this.dialog.open(PunchEditComponent, {
      height: '300px',
      width: '500px',
      data: {
        punchVm: punchVm, title: "Neue Stempelung"
      }
    }).afterClosed()
      .filter(result => !!result)
      .subscribe((editPunchVm: PunchVm) => {
        switch (editPunchVm.editResult) {
          case EditResultEnum.Save:
            // this.punchService.updatePunch(editPunchVm).subscribe(response => {
            //   this.punchService.updatePunch(editPunchVm);
            // });
            break;
        }
      });
  }

  editPunch(punchVm: PunchVm) {
    this.dialog.open(PunchEditComponent, {
      height: '300px',
      width: '500px',
      data: {
        punchVm: punchVm,
        title: "Stempelung editieren"
      }
    }).afterClosed()
      .filter(result => !!result)
      .subscribe((editPunchVm: PunchVm) => {
        switch (editPunchVm.editResult) {
          case EditResultEnum.Delete:
            this.punchService.deletePunch(editPunchVm).subscribe((response: OpResult) => {
              if (response.success)
                this.getToday();
              else
                this.handleError(response.result);
            });
            break;
          case EditResultEnum.Save:
            this.punchService.updatePunch(editPunchVm).subscribe((response: OpResult) => {
              if (response.success)
                this.getToday();
              else
                this.handleError(response.result);
            });
            break;
        }
      });
  }

  tabChanged(event: MdTabChangeEvent) {
    console.log("tabChanged: " + event.index);
    switch (event.index) {
      case 0:
        this.getToday();
        break;
      case 1:
        this.getWeek();
        break;
      case 2:
        this.getMonth();
        break;
      case 3:
        this.getYear();
        break;
    }
  }

  yearChanged() {
    this.punchService.getYear(this.year).subscribe(response =>
      this.punchYearVm = response
    );
  }

  monthChanged() {
    this.punchService.getMonth(this.month, this.year).subscribe(response =>
      this.punchMonthVm = response
    );
  }

  weekChanged() {
    let w = new HtWeekNumPipe();
    this.punchService.getWeek(w.transform(this.week), this.year).subscribe(response =>
      this.punchWeekVm = response
    );
  }

  getToday() {
    this.punchService.getToday(undefined, undefined, undefined).subscribe(response => {
      this.punchDayVm = response;
    });
  }

  getWeek() {
    this.punchService.getWeek(undefined, undefined).subscribe(response => {
      this.punchWeekVm = response;
    });
  }

  getMonth() {
    this.punchService.getMonth(undefined, undefined).subscribe(response =>
      this.punchMonthVm = response
    );
  }

  getYear() {
    this.punchService.getYear(this.year).subscribe(response =>
      this.punchYearVm = response
    );
  }

  handleError(err: string) {
    if (err) {
      // let toast = this.toastController.create({
      //   message: err,
      //   duration: 10000,
      //   showCloseButton: true
      // });
      // toast.present();
    }
  }
}
