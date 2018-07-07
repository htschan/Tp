// src/services/auth/auth.service.ts

import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';
import { TpPunchClient, TpPuClient, PunchDto, DayPunchesDto, DeletePunchDto } from '../../services/client-proxy';
import { ModifyPunchDto, OpResult, WeekPunchesDto, MonthPunchesDto, YearPunchesDto, StatusAdminDto } from '../../services/client-proxy';
export const BUILD_INFO = new InjectionToken<string>('BUILD_INFO');

@Injectable()
export class PunchService {

    constructor(private tpClient: TpPunchClient, private tpPuClient: TpPuClient) {
    }

    punch(dir: string): Observable<PunchDayVm> {
        return dir === 'In' ? this.tpClient.punchIn().map(dayResponse => {
            return new PunchDayVm(dayResponse.punches);
        },
            e => console.log('error punchin')) : this.tpClient.punchOut().map(dayResponse => {
                return new PunchDayVm(dayResponse.punches);
            });
    }

    getDay(day: number | undefined, month: number | undefined, year: number | undefined): Observable<PunchDayVm> {
        return this.tpClient.getDayPunches(day, month, year).map(dayResponse => {
            return new PunchDayVm(dayResponse.punches);
        });
    }

    getPreviousDay(currentDay: PunchDayVm): Observable<PunchDayVm> {
        const d = currentDay.getPreviousDay();
        return this.tpClient.getDayPunches(d.getDate(), d.getMonth() + 1, d.getFullYear()).map(dayResponse => {
            return new PunchDayVm(dayResponse.punches);
        });
    }

    getNextDay(currentDay: PunchDayVm): Observable<PunchDayVm> {
        const d = currentDay.getNextDay();
        return this.tpClient.getDayPunches(d.getDate(), d.getMonth() + 1, d.getFullYear()).map(dayResponse => {
            return new PunchDayVm(dayResponse.punches);
        });
    }

    nextDayAvailable(currentDay: PunchDayVm): boolean {
        return moment().isAfter(currentDay.getDate(), 'day');
    }

    getWeek(week: number | undefined, year: number | undefined): Observable<PunchWeekVm> {
        return this.tpClient.getWeekPunches(week, year).map(weekResponse => {
            return new PunchWeekVm(weekResponse.punches);
        });
    }

    getPreviousWeek(currentWeek: PunchWeekVm): Observable<PunchWeekVm> {
        const d = currentWeek.getPreviousWeek();
        return this.tpClient.getWeekPunches(moment(d).isoWeek(), d.getFullYear()).map(dayResponse => {
            return new PunchWeekVm(dayResponse.punches);
        });
    }

    getNextWeek(currentWeek: PunchWeekVm): Observable<PunchWeekVm> {
        const d = currentWeek.getNextWeek();
        return this.tpClient.getWeekPunches(moment(d).isoWeek(), d.getFullYear()).map(dayResponse => {
            return new PunchWeekVm(dayResponse.punches);
        });
    }

    nextWeekAvailable(currentWeek: PunchWeekVm): boolean {
        return moment().isAfter(currentWeek.getDate(), 'week');
    }

    getMonth(month: number | undefined, year: number | undefined): Observable<PunchMonthVm> {
        return this.tpClient.getMonthPunches(month, year).map(monthResponse => {
            return new PunchMonthVm(monthResponse.punches);
        });
    }

    puGetMonth(userId: string, month: number | undefined, year: number | undefined): Observable<PunchMonthVm> {
        return this.tpPuClient.getMonthPunches(userId, month, year).map(monthResponse => {
            return new PunchMonthVm(monthResponse.punches);
        });
    }

    getPreviousMonth(currentMonth: PunchMonthVm): Observable<PunchMonthVm> {
        const d = currentMonth.getPreviousMonth();
        return this.tpClient.getMonthPunches(d.getMonth() + 1, d.getFullYear()).map(monthResponse => {
            return new PunchMonthVm(monthResponse.punches);
        });
    }

    getNextMonth(currentMonth: PunchMonthVm): Observable<PunchMonthVm> {
        const d = currentMonth.getNextMonth();
        return this.tpClient.getMonthPunches(d.getMonth() + 1, d.getFullYear()).map(monthResponse => {
            return new PunchMonthVm(monthResponse.punches);
        });
    }

    nextMonthAvailable(currentMonth: PunchMonthVm): boolean {
        return moment().isAfter(currentMonth.getDate(), 'month');
    }

    getYear(year: number | undefined): Observable<PunchYearVm> {
        return this.tpClient.getYearPunches(year).map(yearResponse => {
            return new PunchYearVm(yearResponse.punches);
        });
    }

    getPreviousYear(currentYear: PunchYearVm): Observable<PunchYearVm> {
        const d = currentYear.getPreviousYear();
        return this.tpClient.getYearPunches(d.getFullYear()).map(yearResponse => {
            return new PunchYearVm(yearResponse.punches);
        });
    }

    getNextYear(currentYear: PunchYearVm): Observable<PunchYearVm> {
        const d = currentYear.getNextYear();
        return this.tpClient.getYearPunches(d.getFullYear()).map(yearResponse => {
            return new PunchYearVm(yearResponse.punches);
        });
    }

    nextYearAvailable(currentYear: PunchYearVm): boolean {
        return moment().isAfter(currentYear.getDate(), 'year');
    }

    updatePunch(punchVm: PunchVm): Observable<any> {
        const punchDto = new ModifyPunchDto();
        punchDto.punchid = punchVm.id;
        punchDto.direction = punchVm.direction;
        punchDto.timedec = punchVm.timedec;
        return this.tpClient.punchModify(punchDto);
    }

    deletePunch(punchVm: PunchVm): Observable<any> {
        const punchDto = new DeletePunchDto();
        punchDto.punchid = punchVm.id;
        return this.tpClient.punchDelete(punchDto);
    }

    setStatusAdmin(state: StatusAdminDto): Observable<any> {
        return this.tpPuClient.setMonthStatus(state);
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
    time?: moment.Moment | undefined;
    timedec?: number | undefined;
    /** True means enter work, False means leave work. */
    direction?: boolean | undefined;

    timeEdit?: moment.Moment | undefined;
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
    enter?: PunchVm | undefined;
    leave?: PunchVm | undefined;
    sum = 0.0;

    calcSum() {
        if (this.enter && this.leave) {
            this.sum = this.leave.timedec - this.enter.timedec;
        }
    }
}

export class PunchDayVm {
    punchRow?: PunchRowVm[] = [];
    daySum?: number;
    date?: Date | undefined;

    constructor(dto: DayPunchesDto) {
        this.setDayPunches(dto);
    }

    setDayPunches(dto: DayPunchesDto) {
        for (const punch of dto.punches) {
            const vm = new PunchRowVm();
            vm.enter = punch.enter ? new PunchVm(punch.enter) : null;
            vm.leave = punch.leave ? new PunchVm(punch.leave) : null;
            vm.sum = punch.rowTotal;
            this.punchRow.push(vm);
        }
        this.daySum = dto.daytotal;
        this.date = new Date(dto.year, dto.month - 1, dto.day);
    }

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
    punchDays?: PunchDayVm[] = [];
    weekSum = 0.0;
    week: number;
    year: number;


    constructor(dto: DayPunchesDto) {
        this.setWeekPunches(dto);
    }

    setWeekPunches(dto: WeekPunchesDto) {
        for (const dayPunchesDto of dto.dayPunches) {
            const vm = new PunchDayVm(dayPunchesDto);
            this.weekSum += vm.daySum;
            this.punchDays.push(vm);
        }
        this.week = dto.week;
        this.year = dto.year;
    }

    getPreviousWeek(): Date {
        return moment(this.getDate()).subtract(1, 'week').toDate();
    }

    getNextWeek(): Date {
        return moment(this.getDate()).add(1, 'week').toDate();
    }

    getDate(): Date {
        const d = moment();
        d.year(this.year);
        d.isoWeek(this.week);
        return d.toDate();
    }
}

export class PunchMonthVm {
    punchDays?: PunchDayVm[] = [];
    monthSum = 0.0;
    month: number;
    year: number;
    state: StatusAdminDto;


    constructor(dto: MonthPunchesDto) {
        this.setMonthPunches(dto);
    }

    setMonthPunches(dto: MonthPunchesDto) {
        for (const dayPunchesDto of dto.punches) {
            const vm = new PunchDayVm(dayPunchesDto);
            this.monthSum += vm.daySum;
            this.punchDays.push(vm);
        }
        this.month = dto.month;
        this.year = dto.year;
        this.state = dto.state;
    }

    getPreviousMonth(): Date {
        return moment(this.getDate()).subtract(1, 'month').toDate();
    }

    getNextMonth(): Date {
        return moment(this.getDate()).add(1, 'month').toDate();
    }

    getDate(): Date {
        const d = moment();
        d.year(this.year);
        d.month(this.month - 1);
        return d.toDate();
    }
}

export class PunchYearVm {
    punchMonths?: PunchMonthVm[] = [];
    yearSum = 0.0;
    year: number;

    constructor(dto: YearPunchesDto) {
        this.setYearPunches(dto);
    }

    setYearPunches(dto: YearPunchesDto) {
        for (const monthPunchesDto of dto.punches) {
            const vm = new PunchMonthVm(monthPunchesDto);
            this.yearSum += vm.monthSum;
            this.punchMonths.push(vm);
        }
        this.year = dto.year;
    }

    getPreviousYear(): Date {
        return moment(this.getDate()).subtract(1, 'year').toDate();
    }

    getNextYear(): Date {
        return moment(this.getDate()).add(1, 'year').toDate();
    }

    getDate(): Date {
        const d = moment();
        d.year(this.year);
        return d.toDate();
    }
}
