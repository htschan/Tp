// src/services/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TpClient, DayResponse, WeekResponse, MonthResponse, YearResponse, PunchDto } from '../../services/api.g';

@Injectable()
export class PunchService {

    constructor(private tpClient: TpClient) {
    }

    punch(dir: string): Observable<DayResponse> {
        return dir === "In" ? this.tpClient.punchIn() : this.tpClient.punchOut();
    }

    getToday(): Observable<DayResponse> {
        return this.tpClient.getToday();
    }

    getWeek(): Observable<WeekResponse> {
        return this.tpClient.getThisWeek();
    }

    getMonth(): Observable<MonthResponse> {
        return this.tpClient.getThisMonth();
    }

    getYear(): Observable<YearResponse> {
        return this.tpClient.getThisYear();
    }
}

export class PunchRowVm {
    calcSum() {
        if (this.enter && this.leave)
            this.sum = this.leave.timedec - this.enter.timedec;
    }
    enter?: PunchDto | undefined;
    leave?: PunchDto | undefined;
    sum?: number | undefined;
}

export class PunchDayVm {

    constructor(dayResponse: DayResponse) {
        this.setDayPunches(dayResponse);
    }
    setDayPunches(dayResponse: DayResponse) {
        let i = 0;
        do {
            let vm = new PunchRowVm();
            let punchDto = dayResponse.punches.punches[i];
            if (punchDto.direction) {
                vm.enter = punchDto;
                if (i < dayResponse.punches.punches.length && !dayResponse.punches.punches[i+1].direction) {
                    i++;
                    vm.leave = dayResponse.punches.punches[i];
                }
            }
            else {
                vm.leave = punchDto;
            }
            this.punchRow.push(vm);
            i++;
        } while (i < dayResponse.punches.punches.length);

    }
    punchRow?: PunchRowVm[] | undefined;
    daySum?: number | undefined;
    date?: Date | undefined;
}