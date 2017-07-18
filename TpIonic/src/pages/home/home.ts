import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

import { Events, NavController } from 'ionic-angular';
import { PunchService } from '../../services/puncher/punch.service';
import { AuthService } from '../../services/auth/auth.service';
import { DayPunchesDto, WeekPunchesDto, MonthPunchesDto, PunchResponse } from '../../services/api.g';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;
  title: String = ' ';
  daypunches: DayPunchesDto;
  weekpunches: WeekPunchesDto;
  monthpunches: MonthPunchesDto;

  constructor(public events: Events, public navCtrl: NavController, private punchService: PunchService, private auth: AuthService) {
    events.subscribe('title:updated', (data) => {
      if (data.menuState) {
        this.title = "Projects";
      } else {
        this.title = ' ';
      }
    });
    this.getToday();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  enter() {
    this.punchService.punch('In')
      .subscribe(response =>
        this.daypunches = response.punches
      );
  }

  leave() {
    this.punchService.punch('Out')
      .subscribe(response =>
        this.daypunches = response.punches
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
      .subscribe(response =>
        this.daypunches = response.punches
      );
  }

  getWeek() {
    this.punchService.getWeek()
      .subscribe(data =>
        this.weekpunches = data.punches
      );
  }

  getMonth() {
    this.punchService.getMonth()
      .subscribe(data =>
        this.monthpunches = data.punches
      );
  }
}
