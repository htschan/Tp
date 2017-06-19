import { List } from 'linqts';
import { Punch } from '../entity/punch';
import * as models from '../model/models';

export class PunchVm {
    constructor(
        public id: number,
        public t: Date, // time
        public td: number, // time decimal
        public dir: boolean, // true: In, false: Out
        public d: number, // day
        public w: number, // week
        public y?: number, // year
        public m?: number, // month
    ) { }
}

export class PunchVms {
    constructor(punches: Punch[]) {
        this.punchVms = new Array();
        for (let punch of punches) {
            this.punchVms.push(new PunchVm(punch.id, punch.time, punch.timedec, punch.direction, punch.day.day, punch.week.week, punch.year.year, punch.month.month));
        }
        let list = new List<PunchVm>(this.punchVms);
        let grouped = list.GroupBy(vm => vm.d, vm => vm);
        this.xVms = new Array();
        for (let d in grouped) {
            // console.log(grouped[d]);
            let dp = new List<PunchVm>(grouped[d]);
            let sortedDp = dp.OrderBy(vm => vm.td);
            let sortedDpArray = sortedDp.ToArray();
            let dpVm = new DayPunchesVm(d, sortedDpArray);
            this.xVms.push(dpVm);
        }
        //this.dayResponse.status.success = true;
        // this.dayResponse.status.result = { status: 200, message: "Succes" }
        // this.dayResponse.punches.day =
    }
    punchVms: PunchVm[];
    xVms: DayPunchesVm[];
    dayResponse: models.DayResponse;
}

export class DayPunchesVm {
    constructor(day: string, sortedDpArray: PunchVm[]) {
        this.day = day;
        let n = 6 - sortedDpArray.length;
        for (let i = 0; i < n; i++) {
            sortedDpArray.push(new PunchVm(-1, new Date(), 0, true, parseInt(day), 0));
        }
        this.p1 = sortedDpArray[0].td == 0 ? "" : sortedDpArray[0].td.toString();
        this.p2 = sortedDpArray[1].td == 0 ? "" : sortedDpArray[1].td.toString();
        this.p3 = sortedDpArray[2].td == 0 ? "" : sortedDpArray[2].td.toString();
        this.p4 = sortedDpArray[3].td == 0 ? "" : sortedDpArray[3].td.toString();
        this.p5 = sortedDpArray[4].td == 0 ? "" : sortedDpArray[4].td.toString();
        this.p6 = sortedDpArray[5].td == 0 ? "" : sortedDpArray[5].td.toString();
    }
    day: string;
    p1: string;
    p2: string;
    p3: string;
    p4: string;
    p5: string;
    p6: string;
}
