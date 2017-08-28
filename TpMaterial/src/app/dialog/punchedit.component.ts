import { Component, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { PunchVm, EditResultEnum } from "../services/puncher/punch.service";

@Component({
  templateUrl: 'punchedit.component.html'
})
export class PunchEditComponent {
  punchTime: string;
  time: string;
  isDarkTheme = true;
  punchVm: PunchVm;
  title: string;
  
  constructor(public dialogRef: MdDialogRef<PunchEditComponent>, @Inject(MD_DIALOG_DATA) public dlgData: any) {
    this.punchVm = dlgData.punchVm;
    this.title = dlgData.title;
    this.punchTime = this.punchVm.time.toLocaleTimeString();
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
