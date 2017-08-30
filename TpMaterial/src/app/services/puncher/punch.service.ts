// src/services/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TpClient, DayResponse, WeekResponse, MonthResponse, YearResponse, PunchDto, DayPunchesDto, DeletePunchDto, PunchResponse, ModifyPunchDto, OpResult, WeekPunchesDto, MonthPunchesDto, YearPunchesDto } from '../../services/api.g';

@Injectable()
export class PunchService {

    constructor(private tpClient: TpClient) {
    }

    punch(dir: string): Observable<PunchDayVm> {
        return dir === "In" ? this.tpClient.punchIn().map(dayResponse => {
            return new PunchDayVm(dayResponse.punches);
        }) : this.tpClient.punchOut().map(dayResponse => {
            return new PunchDayVm(dayResponse.punches);
        });
    }

    getToday(): Observable<PunchDayVm> {
        return this.tpClient.getToday().map(dayResponse => {
            return new PunchDayVm(dayResponse.punches);
        });
    }

    getWeek(): Observable<PunchWeekVm> {
        return this.tpClient.getThisWeek().map(weekResponse => {
            return new PunchWeekVm(weekResponse.punches);
        });
    }

    getMonth(): Observable<PunchMonthVm> {
        return this.tpClient.getThisMonth().map(monthResponse => {
            return new PunchMonthVm(monthResponse.punches);
        });
    }

    getYear(): Observable<PunchYearVm> {
        return this.tpClient.getThisYear().map(yearResponse => {
            return new PunchYearVm(yearResponse.punches);
        });
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

    constructor(dto: DayPunchesDto) {
        this.setDayPunches(dto);
    }

    setDayPunches(dto: DayPunchesDto) {
        for (let punch of dto.punches) {
            let vm = new PunchRowVm();
            vm.enter = punch.enter ? new PunchVm(punch.enter) : null;
            vm.leave = punch.leave ? new PunchVm(punch.leave) : null;
            vm.sum = punch.rowTotal;
            this.punchRow.push(vm);
        }
        this.daySum = dto.daytotal;
        this.date = new Date(dto.year, dto.month - 1, dto.day);
    }
    punchRow?: PunchRowVm[] = [];
    daySum?: number;
    date?: Date | undefined;
}

export class PunchWeekVm {

    constructor(dto: DayPunchesDto) {
        this.setWeekPunches(dto);
    }

    setWeekPunches(dto: WeekPunchesDto) {
        for (let dayPunchesDto of dto.dayPunches) {
            let vm = new PunchDayVm(dayPunchesDto);
            this.weekSum += vm.daySum;
            this.punchDays.push(vm);
        }
        this.week = dto.week;
        this.year = dto.year;
    }

    punchDays?: PunchDayVm[] = [];
    weekSum: number = 0.0;
    week: number;
    year: number;
}

export class PunchMonthVm {

    constructor(dto: MonthPunchesDto) {
        this.setMonthPunches(dto);
    }

    setMonthPunches(dto: MonthPunchesDto) {
        for (let dayPunchesDto of dto.punches) {
            let vm = new PunchDayVm(dayPunchesDto);
            this.monthSum += vm.daySum;
            this.punchDays.push(vm);
        }
        this.month = dto.month;
        this.year = dto.year;
    }

    punchDays?: PunchDayVm[] = [];
    monthSum: number = 0.0;
    month: number;
    year: number;
}

export class PunchYearVm {

    constructor(dto: YearPunchesDto) {
        this.setYearPunches(dto);
    }

    setYearPunches(dto: YearPunchesDto) {
        for (let monthPunchesDto of dto.punches) {
            let vm = new PunchMonthVm(monthPunchesDto);
            this.yearSum += vm.monthSum;
            this.punchMonths.push(vm);
        }
        this.year = dto.year;
    }

    punchMonths?: PunchMonthVm[] = [];
    yearSum: number = 0.0;
    year: number;
}