import { Component, ViewChild } from '@angular/core';
import { Events, Slides, ModalController, ToastController } from 'ionic-angular';
import { PunchService, PunchDayVm, PunchVm, EditResultEnum } from '../../services/puncher/punch.service';
import { WeekPunchesDto, MonthPunchesDto, PunchDto, OpResult } from '../../services/api.g';
import { PunchEditModal } from '../punchedit/punchedit';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;
  title: String = ' ';
  punchDayVm: PunchDayVm;
  weekpunches: WeekPunchesDto;
  monthpunches: MonthPunchesDto;

  constructor(public events: Events,
    private modalCtrl: ModalController,
    private punchService: PunchService,
    private toastController: ToastController) {
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
      .subscribe(response => {
        this.punchDayVm = response;
      });
  }

  leave() {
    this.punchService.punch('Out')
      .subscribe(response => {
        this.punchDayVm = response;
      });
  }

  addPunch() {
    let timeEditModal = this.modalCtrl.create(PunchEditModal, { punchVm: new PunchVm(new PunchDto()), title: "Neue Stempelung" });
    timeEditModal.onDidDismiss(editPunchVm => {
      switch (editPunchVm.editResult) {
        case EditResultEnum.Save:
          // this.punchService.updatePunch(editPunchVm).subscribe(response => {
          //   this.punchService.updatePunch(editPunchVm);
          // });
          break;
      }
    })
    timeEditModal.present();
  }

  editPunch(punchVm: PunchVm) {
    let timeEditModal = this.modalCtrl.create(PunchEditModal, { punchVm: punchVm, title: "Stempelung editieren" });
    timeEditModal.onDidDismiss((editPunchVm: PunchVm) => {
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
    })
    timeEditModal.present();
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
    this.punchService.getToday().subscribe(response => {
      this.punchDayVm = response;
    });
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

  handleError(err: string) {
    if (err) {
      let toast = this.toastController.create({
        message: err,
        duration: 10000,
        showCloseButton: true
      });
      toast.present();
    }
  }
}
