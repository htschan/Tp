// src/services/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TpClient, DayResponse, WeekResponse, MonthResponse, YearResponse, PunchDto, DayPunchesDto, DeletePunchDto, PunchResponse, ModifyPunchDto, OpResult } from '../../services/api.g';

@Injectable()
export class PunchService {

    constructor(private tpClient: TpClient) {
    }

    punch(dir: string): Observable<PunchDayVm> {
        return dir === "In" ? this.tpClient.punchIn().map(dayResponse => {
            return new PunchDayVm(dayResponse);
        }) : this.tpClient.punchOut().map(dayResponse => {
            return new PunchDayVm(dayResponse);
        });
    }

    getToday(): Observable<PunchDayVm> {
        return this.tpClient.getToday().map(dayResponse => {
            return new PunchDayVm(dayResponse);
        });
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

    updatePunch(punchVm: PunchVm): Observable<PunchResponse> {
        let punchDto = new ModifyPunchDto();
        punchDto.punchid = punchVm.id;
        punchDto.direction = punchVm.direction;
        punchDto.timedec = punchVm.timedec;
        return this.tpClient.punchModify(punchDto);
    }

    deletePunch(punchVm: PunchVm): Observable<OpResult> {
        let punchDto = new DeletePunchDto();
        punchDto.punchid = punchVm.id;
        return this.tpClient.punchDelete(punchDto);
    }
}

export class PunchVm {
    constructor(punchDto: PunchDto) {
        this.id = punchDto.punchid;
        this.time = punchDto.time;
        this.timedec = punchDto.timedec;
        this.direction = punchDto.direction;
        this.timeEdit = punchDto.time;
        this.timedecEdit = punchDto.timedec;
        this.directionEdit = punchDto.direction;
    }
    id: string;
    time?: Date | undefined;
    timedec?: number | undefined;
    /** True means enter work, False means leave work. */
    direction?: boolean | undefined;

    timeEdit?: Date | undefined;
    timedecEdit?: number | undefined;
    directionEdit?: boolean | undefined;
    editResult: EditResultEnum = EditResultEnum.Undefined;

    resetChanges() {
        this.timeEdit = this.time;
        this.timedecEdit = this.timedec;
        this.directionEdit = this.direction;
    }
    hasChanged(): boolean {
        return this.time !== this.timeEdit;
    }
}

export enum EditResultEnum {
    Undefined,
    Save,
    Delete
}
export class PunchRowVm {
    calcSum() {
        if (this.enter && this.leave)
            this.sum = this.leave.timedec - this.enter.timedec;
    }
    enter?: PunchVm | undefined;
    leave?: PunchVm | undefined;
    sum?: number = 0.0;
}

export class PunchDayVm {

    constructor(dayResponse: DayResponse) {
        this.setDayPunches(dayResponse.punches);
    }
    setDayPunches(dto: DayPunchesDto) {
        for (let punch of dto.punches) {
            let vm = new PunchRowVm();
            vm.enter = new PunchVm(punch.enter);
            vm.leave = new PunchVm(punch.leave);
            this.punchRow.push(vm);
        }
        this.daySum = dto.daytotal;
        this.date = new Date(dto.year, dto.month, dto.day);
        // let i = 0;
        // if (dto.punches.length > 0) {
        //     this.date = new Date(dto.year, dto.month - 1, dto.day);
        // }
        // do {
        //     let vm = new PunchRowVm();
        //     if (dto.punches.length > 0) {
        //         let punchDto = dto.punches[i];
        //         if (punchDto.direction) {
        //             vm.enter = new PunchVm(punchDto);
        //             if (i < dto.punches.length - 1 && !dto.punches[i + 1].direction) {
        //                 i++;
        //                 vm.leave = new PunchVm(dto.punches[i]);
        //             }
        //         }
        //         else {
        //             vm.leave = new PunchVm(punchDto);
        //         }
        //     }
        //     this.punchRow.push(vm);
        //     i++;
        // } while (i < dto.punches.length);
        // this.daySum = 0.0;
        // for (let row of this.punchRow) {
        //     row.calcSum();
        //     this.daySum += row.sum;
        // }
    }
    punchRow?: PunchRowVm[] = [];
    daySum?: number;
    date?: Date | undefined;
}