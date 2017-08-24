import { Component, OnInit } from '@angular/core';
import { MdIconRegistry, MdDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MdTabChangeEvent } from '@angular/material';

import { PunchService, PunchDayVm, PunchVm, EditResultEnum } from '../../services/puncher/punch.service';
import { WeekPunchesDto, MonthPunchesDto, PunchDto, OpResult } from '../../services/api.g';

import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  punchDayVm: PunchDayVm;
  weekpunches: WeekPunchesDto;
  monthpunches: MonthPunchesDto;

  users = [
    {
      name: 'Lia Lugo',
      avatar: 'svg-11',
      details: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage ' +
      'cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta ' +
      'who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue ' +
      'castello caerphilly chalk and cheese. Lancashire.',
      isAdmin: true,
      isCool: false
    }
  ]
  selectedUser = this.users[0];

  constructor(iconRegistry: MdIconRegistry, sanitizer: DomSanitizer, private dialog: MdDialog, private punchService: PunchService) { }

  ngOnInit() {
    this.getToday();
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



  openAdminDialog() {
    this.dialog.open(DialogComponent).afterClosed()
      .filter(result => !!result)
      .subscribe(user => {
        this.users.push(user);
        this.selectedUser = user;
      });
  }
  addPunch() {
    // let timeEditModal = this.modalCtrl.create(PunchEditModal, { punchVm: new PunchVm(new PunchDto()), title: "Neue Stempelung" });
    // timeEditModal.onDidDismiss(editPunchVm => {
    //   switch (editPunchVm.editResult) {
    //     case EditResultEnum.Save:
    //       // this.punchService.updatePunch(editPunchVm).subscribe(response => {
    //       //   this.punchService.updatePunch(editPunchVm);
    //       // });
    //       break;
    //   }
    // })
    // timeEditModal.present();
  }

  editPunch(punchVm: PunchVm) {
    // let timeEditModal = this.modalCtrl.create(PunchEditModal, { punchVm: punchVm, title: "Stempelung editieren" });
    // timeEditModal.onDidDismiss((editPunchVm: PunchVm) => {
    //   switch (editPunchVm.editResult) {
    //     case EditResultEnum.Delete:
    //       this.punchService.deletePunch(editPunchVm).subscribe((response: OpResult) => {
    //         if (response.success)
    //           this.getToday();
    //         else
    //           this.handleError(response.result);
    //       });
    //       break;
    //     case EditResultEnum.Save:
    //       this.punchService.updatePunch(editPunchVm).subscribe((response: OpResult) => {
    //         if (response.success)
    //           this.getToday();
    //         else
    //           this.handleError(response.result);
    //       });
    //       break;
    //   }
    // })
    // timeEditModal.present();
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
      // let toast = this.toastController.create({
      //   message: err,
      //   duration: 10000,
      //   showCloseButton: true
      // });
      // toast.present();
    }
  }
}
