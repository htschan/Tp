// src/services/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';
import { TpClient, PunchDto, DayPunchesDto, DeletePunchDto, PunchResponse, ModifyPunchDto, OpResult, WeekPunchesDto, MonthPunchesDto, YearPunchesDto } from '../../services/api.g';

@Injectable()
export class PunchService {

    constructor(private tpClient: TpClient) {
    }

    punch(dir: string): Observable<PunchDayVm> {
        return dir === "In" ? this.tpClient.punchIn().map(dayResponse => {
            return new PunchDayVm(dayResponse.punches);
        },
            e => console.log("error punchin")) : this.tpClient.punchOut().map(dayResponse => {
                return new PunchDayVm(dayResponse.punches);
            });
    }

    getDay(day: number | undefined, month: number | undefined, year: number | undefined): Observable<PunchDayVm> {
        return this.tpClient.getDay(day, month, year).map(dayResponse => {
            return new PunchDayVm(dayResponse.punches);
        });
    }

    getPreviousDay(currentDay: PunchDayVm): Observable<PunchDayVm> {
        let d = currentDay.getPreviousDay();
        return this.tpClient.getDay(d.getDate(), d.getMonth() + 1, d.getFullYear()).map(dayResponse => {
            return new PunchDayVm(dayResponse.punches);
        });
    }

    getNextDay(currentDay: PunchDayVm): Observable<PunchDayVm> {
        let d = currentDay.getNextDay();
        return this.tpClient.getDay(d.getDate(), d.getMonth() + 1, d.getFullYear()).map(dayResponse => {
            return new PunchDayVm(dayResponse.punches);
        });
    }

    nextDayAvailable(currentDay: PunchDayVm): boolean {
        return moment().isAfter(currentDay.getDate(), 'day');
    }

    getWeek(week: number | undefined, year: number | undefined): Observable<PunchWeekVm> {
        return this.tpClient.getWeek(week, year).map(weekResponse => {
            return new PunchWeekVm(weekResponse.punches);
        });
    }

    getPreviousWeek(currentWeek: PunchWeekVm): Observable<PunchWeekVm> {
        let d = currentWeek.getPreviousWeek();
        return this.tpClient.getWeek(moment(d).isoWeek(), d.getFullYear()).map(dayResponse => {
            return new PunchWeekVm(dayResponse.punches);
        });
    }

    getNextWeek(currentWeek: PunchWeekVm): Observable<PunchWeekVm> {
        let d = currentWeek.getNextWeek();
        return this.tpClient.getWeek(moment(d).isoWeek(), d.getFullYear()).map(dayResponse => {
            return new PunchWeekVm(dayResponse.punches);
        });
    }

    nextWeekAvailable(currentWeek: PunchWeekVm): boolean {
        return moment().isAfter(currentWeek.getDate(), 'week');
    }

    getMonth(month: number | undefined, year: number | undefined): Observable<PunchMonthVm> {
        return this.tpClient.getMonth(month, year).map(monthResponse => {
            return new PunchMonthVm(monthResponse.punches);
        });
    }

    getPreviousMonth(currentMonth: PunchMonthVm): Observable<PunchMonthVm> {
        let d = currentMonth.getPreviousMonth();
        return this.tpClient.getMonth(d.getMonth() + 1, d.getFullYear()).map(monthResponse => {
            return new PunchMonthVm(monthResponse.punches);
        });
    }

    getNextMonth(currentMonth: PunchMonthVm): Observable<PunchMonthVm> {
        let d = currentMonth.getNextMonth();
        return this.tpClient.getMonth(d.getMonth() + 1, d.getFullYear()).map(monthResponse => {
            return new PunchMonthVm(monthResponse.punches);
        });
    }

    nextMonthAvailable(currentMonth: PunchMonthVm): boolean {
        return moment().isAfter(currentMonth.getDate(), 'month');
    }

    getYear(year: number | undefined): Observable<PunchYearVm> {
        return this.tpClient.getYear(year).map(yearResponse => {
            return new PunchYearVm(yearResponse.punches);
        });
    }

    getPreviousYear(currentYear: PunchYearVm): Observable<PunchYearVm> {
        let d = currentYear.getPreviousYear();
        return this.tpClient.getYear(d.getFullYear()).map(yearResponse => {
            return new PunchYearVm(yearResponse.punches);
        });
    }

    getNextYear(currentYear: PunchYearVm): Observable<PunchYearVm> {
        let d = currentYear.getNextYear();
        return this.tpClient.getYear(d.getFullYear()).map(yearResponse => {
            return new PunchYearVm(yearResponse.punches);
        });
    }

    nextYearAvailable(currentYear: PunchYearVm): boolean {
        return moment().isAfter(currentYear.getDate(), 'year');
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

    getPreviousDay(): Date {
        return moment(this.date).subtract(1, 'day').toDate();
    }

    getNextDay(): Date {
        return moment(this.date).add(1, 'day').toDate();
    }

    getDate(): Date {
        return this.date;
    }
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

    getPreviousWeek(): Date {
        return moment(this.getDate()).subtract(1, 'week').toDate();
    }

    getNextWeek(): Date {
        return moment(this.getDate()).add(1, 'week').toDate();
    }

    getDate(): Date {
        let d = moment();
        d.year(this.year);
        d.isoWeek(this.week);
        return d.toDate();
    }
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

    getPreviousMonth(): Date {
        return moment(this.getDate()).subtract(1, 'month').toDate();
    }

    getNextMonth(): Date {
        return moment(this.getDate()).add(1, 'month').toDate();
    }

    getDate(): Date {
        let d = moment();
        d.year(this.year);
        d.month(this.month - 1);
        return d.toDate();
    }
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

    getPreviousYear(): Date {
        return moment(this.getDate()).subtract(1, 'year').toDate();
    }

    getNextYear(): Date {
        return moment(this.getDate()).add(1, 'year').toDate();
    }

    getDate(): Date {
        let d = moment();
        d.year(this.year);
        return d.toDate();
    }
}