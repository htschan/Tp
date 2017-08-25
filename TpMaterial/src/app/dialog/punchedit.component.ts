import { Component, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { PunchVm, EditResultEnum } from "../services/puncher/punch.service";

@Component({
  templateUrl: 'punchedit.component.html'
})
export class PunchEditComponent {
  punchTime: string;
  time: string;
  isDarkTheme = false;
  
  constructor(public dialogRef: MdDialogRef<PunchEditComponent>, @Inject(MD_DIALOG_DATA) public dlgData: any) {
    this.punchTime = this.dlgData.punchVm.time.toLocaleTimeString();
    this.time = this.punchTime;
  }

  delete() {
    this.dlgData.punchVm.editResult = EditResultEnum.Delete;
    this.dialogRef.close(this.dlgData.punchVm);
  }

  save() {
    this.dlgData.punchVm.editResult = EditResultEnum.Save;
    this.dialogRef.close(this.dlgData.punchVm);
  }

  reset() {
    this.dlgData.punchVm.resetChanges();
  }

  dismiss() {
    this.dlgData.punchVm.editResult = EditResultEnum.Undefined;
    this.dialogRef.close(this.dlgData.punchVm);
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
