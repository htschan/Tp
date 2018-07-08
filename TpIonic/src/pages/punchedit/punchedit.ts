import { Component } from '@angular/core';
import { Platform, NavParams, ViewController } from 'ionic-angular';
import { PunchVm, EditResultEnum } from "../../services/puncher/punch.service";
import * as moment from 'moment';

@Component({
    templateUrl: 'punchedit.html'
})
export class PunchEditModal {

    title: string;
    punchTime: string;
    punchVm: PunchVm;
    time: string;

    constructor(
        public platform: Platform,
        public params: NavParams,
        public viewCtrl: ViewController
    ) {
        this.punchVm = params.get('punchVm');
        this.title = params.get('title');
        this.punchTime = moment.utc(this.punchVm.time).local().format('HH:mm:ss');
        this.time = this.punchTime;
    }

    delete() {
        this.punchVm.editResult = EditResultEnum.Delete;
        this.viewCtrl.dismiss(this.punchVm);
    }

    save() {
        this.punchVm.editResult = EditResultEnum.Save;
        this.viewCtrl.dismiss(this.punchVm);
    }

    reset() {
        this.punchVm.resetChanges();
    }

    dismiss() {
        this.punchVm.editResult = EditResultEnum.Undefined;
        this.viewCtrl.dismiss(this.punchVm);
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