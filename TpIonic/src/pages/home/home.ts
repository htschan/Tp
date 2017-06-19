import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

import { Events, NavController } from 'ionic-angular';
import { PunchService } from '../../services/puncher/punch.service';
import { DayPunchesVm } from '../../model/models';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;
  title: String = ' ';
  daypunches: DayPunchesVm[];
  weekpunches: DayPunchesVm[];
  monthpunches: DayPunchesVm[];

  constructor(public events: Events, public navCtrl: NavController, private punchService: PunchService) {
    events.subscribe('title:updated', (data) => {
      if (data.menuState) {
        this.title = "Projects";
      } else {
        this.title = ' ';
      }
    });
    this.getToday();
  }

  enter() {
    this.punchService.punch('In')
      .subscribe(data =>
        this.daypunches = data
      );
  }

  leave() {
    this.punchService.punch('Out')
      .subscribe(data =>
        this.daypunches = data
      );
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    console.log("Current index is", currentIndex);
    switch (currentIndex) {
      case 0:
        this.getToday();
        break;
      case 1:
        this.getWeek();
        break;
      case 2:
        this.getMonth();
        break;
    }
  }

  getToday() {
    this.punchService.getToday()
      .subscribe(data =>
        this.daypunches = data
      );
  }

  getWeek() {
    this.punchService.getWeek()
      .subscribe(data =>
        this.weekpunches = data
      );
  }

  getMonth() {
    this.punchService.getMonth()
      .subscribe(data =>
        this.monthpunches = data
      );
  }
}
