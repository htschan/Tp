// src/services/auth/auth.service.ts

import { AuthHttp, JwtHelper } from 'angular2-jwt';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TpClientConfig } from '../../timepuncher-client-config';
import { DayPunchesVm } from '../../model/models';

const punchesUrl: string = `${TpClientConfig.baserurl}api/v1/punches/punch/`;
const todayPunchesUrl: string = `${TpClientConfig.baserurl}api/v1/punches/today`;
const thisWeekPunchesUrl: string = `${TpClientConfig.baserurl}api/v1/punches/thisweek`;
const thisMonthPunchesUrl: string = `${TpClientConfig.baserurl}api/v1/punches/thismonth`;

@Injectable()
export class PunchService {

    jwtHelper: JwtHelper = new JwtHelper();

    constructor(private authHttp: AuthHttp, zone: NgZone) {
    }

    punch(dir: string): Observable<DayPunchesVm[]> {
        return this.authHttp.post(punchesUrl + dir, '')
            .map(res => res.json())
            .map(res => res.data);
    }

    getToday(): Observable<DayPunchesVm[]> {
        return this.authHttp.get(todayPunchesUrl)
            .map(res => res.json())
            .map(res => res.data);
    }

    getWeek(): Observable<DayPunchesVm[]> {
        return this.authHttp.get(thisWeekPunchesUrl)
            .map(res => res.json())
            .map(res => res.data);
    }

    getMonth(): Observable<DayPunchesVm[]> {
        return this.authHttp.get(thisMonthPunchesUrl)
            .map(res => res.json())
            .map(res => res.data);
    }
    /*
        getColumnPunches(data: PunchVm[]): ColumnPunches {
            let punches = new ColumnPunches();
            punches.rows = new Array<RowPunch>();
            data.sort((a: PunchVm, b: PunchVm): number => {
                if (a.timedec < b.timedec) return -1;
                if (a.timedec > b.timedec) return 1;
                return 0;
            });
            let i = 0;
            while (i < data.length) {
                let punchRow = new RowPunch();
                if (data[i].direction) {
                    punchRow.in = new Punch(data[i]);
                    if (i + 1 < data.length && !data[i + 1].direction) {
                        i++;
                        punchRow.out = new Punch(data[i]);
                    }
                } else if (!data[i].direction) {
                    punchRow.out = new Punch(data[i])
                }
                i++;
                punchRow.calcRowSum();
                punches.addRow(punchRow);
            }
            return punches;
        }
        */
}