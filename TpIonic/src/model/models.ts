
/*
export class PunchVm {
    created: string;
    direction: boolean;
    id: number;
    time: Date;
    timedec: number;
    updated: Date;
    version: number;
}

export class Punch {
    timedec: number;
    constructor(vm?: PunchVm) {
        if (vm !== undefined)
            this.timedec = vm.timedec;
    }
}

export class RowPunch {
    in: Punch;
    out: Punch;
    sum: Punch;

    constructor() {
        this.in = new Punch();
        this.out = new Punch();
        this.sum = new Punch();
    }

    calcRowSum() {
        if (this.in !== undefined && this.out !== undefined) {
            this.sum.timedec = this.out.timedec - this.in.timedec;
            // if (isNaN(this.sum.timedec))
            //     this.sum.timedec = null;
        } else {
            this.sum.timedec = 0.11;
        }
    }
}

export class ColumnPunches {
    rows: RowPunch[] = new Array();

    addRow(row: RowPunch) {
        this.rows.push(row);
    }
}
*/

// from TpServer viewmodels.ts
// export class PunchVm {
//     constructor(
//         public id: number,
//         public t: Date, // time
//         public td: number, // time decimal
//         public dir: boolean, // true: In, false: Out
//         public d: number, // day
//         public w: number, // week
//         public y?: number, // year
//         public m?: number, // month
//     ) { }
// }

// export class PunchVms {
//     punchVms: PunchVm[];
//     xVms: DayPunchesVm[];
// }

// export class DayPunchesVm {
//     day: string;
//     p1: string;
//     p2: string;
//     p3: string;
//     p4: string;
//     p5: string;
//     p6: string;
// }
