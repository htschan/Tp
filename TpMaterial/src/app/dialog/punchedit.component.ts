import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PunchVm, EditResultEnum } from '../services/puncher/punch.service';
import * as moment from 'moment';

@Component({
  templateUrl: 'punchedit.component.html'
})
export class PunchEditComponent {
  punchTime: string;
  time: string;
  isDarkTheme = true;
  punchVm: PunchVm;
  title: string;

  constructor(public dialogRef: MatDialogRef<PunchEditComponent>, @Inject(MAT_DIALOG_DATA) public dlgData: any) {
    this.punchVm = dlgData.punchVm;
    this.title = dlgData.title;
    this.punchTime = moment.utc(this.punchVm.time).local().format('HH:mm:ss');
    this.time = this.punchTime;
  }

  delete() {
    this.punchVm.editResult = EditResultEnum.Delete;
    this.dialogRef.close(this.punchVm);
  }

  save() {
    this.punchVm.editResult = EditResultEnum.Save;
    this.dialogRef.close(this.punchVm);
  }

  reset() {
    this.punchVm.resetChanges();
  }

  dismiss() {
    this.punchVm.editResult = EditResultEnum.Undefined;
    this.dialogRef.close(this.punchVm);
  }

  calculateTime(offset: any) {
    // create Date object for current location
    let d = new Date();

    // create new Date object for different city
    // using supplied offset
    let nd = new Date(d.getTime() + (3600000 * offset));
    return nd.toISOString();
  }
}
