// src/services/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TpClient, DayResponse, WeekResponse, MonthResponse, YearResponse } from '../../services/api.g';

@Injectable()
export class PunchService {

    constructor(private tpClient: TpClient) {
    }

    punch(dir: string): Observable<DayResponse> {
        return this.tpClient.punchIn();
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