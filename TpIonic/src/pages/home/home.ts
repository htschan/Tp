import { Component, ViewChild } from '@angular/core';
import { Events, Slides, ModalController, ToastController, AlertController } from 'ionic-angular';
import { PunchService, PunchDayVm, PunchVm, EditResultEnum, PunchWeekVm, PunchMonthVm, PunchYearVm } from '../../services/puncher/punch.service';
import { PunchDto } from '../../app/services/client-proxy';
import { PunchEditModal } from '../punchedit/punchedit';
import { NavGuard } from '../support/nav.guard';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage extends NavGuard {
  @ViewChild(Slides) slides: Slides;
  title: String = ' ';
  punchDayVm: PunchDayVm;
  punchWeekVm: PunchWeekVm;
  punchMonthVm: PunchMonthVm;
  punchYearVm: PunchYearVm;

  constructor(
    public auth: AuthService,
    public events: Events,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public punchService: PunchService,
    public toastController: ToastController) {
    super(auth, modalCtrl, alertCtrl);
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
          this.punchService.deletePunch(editPunchVm).subscribe(() => {
            this.getToday();
          },
            error => {
              this.handleError(error);
            });
          break;
        case EditResultEnum.Save:
          this.punchService.updatePunch(editPunchVm).subscribe(() => {
            this.getToday();
          },
            error => {
              this.handleError(error);
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
      case 3:
        this.getYear();
        break;
    }
  }

  getPreviousDay() {
    this.punchService.getPreviousDay(this.punchDayVm).take(1).subscribe(response => {
      this.punchDayVm = response;
    })
  }

  getNextDay() {
    this.punchService.getNextDay(this.punchDayVm).take(1).subscribe(response => {
      this.punchDayVm = response;
    })
  }

  nextDayAvailable(): boolean {
    if (this.punchDayVm == null)
      return false;
    return this.punchService.nextDayAvailable(this.punchDayVm);
  }

  getToday() {
    this.punchService.getDay(null, null, null).take(1).subscribe(response => {
      this.punchDayVm = response;
    });
  }

  getPreviousWeek() {
    this.punchService.getPreviousWeek(this.punchWeekVm).take(1).subscribe(response => {
      this.punchWeekVm = response;
    })
  }

  getNextWeek() {
    this.punchService.getNextWeek(this.punchWeekVm).take(1).subscribe(response => {
      this.punchWeekVm = response;
    })
  }

  nextWeekAvailable(): boolean {
    if (this.punchWeekVm == null)
      return false;
    return this.punchService.nextWeekAvailable(this.punchWeekVm);
  }

  getWeek() {
    this.punchService.getWeek(null, null).take(1).subscribe(response =>
      this.punchWeekVm = response
    );
  }

  getPreviousMonth() {
    this.punchService.getPreviousMonth(this.punchMonthVm).take(1).subscribe(response => {
      this.punchMonthVm = response;
    })
  }

  getNextMonth() {
    this.punchService.getNextMonth(this.punchMonthVm).take(1).subscribe(response => {
      this.punchMonthVm = response;
    })
  }

  nextMonthAvailable(): boolean {
    if (this.punchMonthVm == null)
      return false;
    return this.punchService.nextMonthAvailable(this.punchMonthVm);
  }

  getMonth() {
    this.punchService.getMonth(null, null).take(1).subscribe(response =>
      this.punchMonthVm = response
    );
  }

  getPreviousYear() {
    this.punchService.getPreviousYear(this.punchYearVm).take(1).subscribe(response => {
      this.punchYearVm = response;
    })
  }

  getNextYear() {
    this.punchService.getNextYear(this.punchYearVm).take(1).subscribe(response => {
      this.punchYearVm = response;
    })
  }

  nextYearAvailable(): boolean {
    if (this.punchYearVm == null)
      return false;
    return this.punchService.nextYearAvailable(this.punchYearVm);
  }

  getYear() {
    this.punchService.getYear(null).take(1).subscribe(response =>
      this.punchYearVm = response
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
