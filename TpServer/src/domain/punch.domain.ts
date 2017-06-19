import { ConnectionManager } from "typeorm";
import { Container, Service } from "typedi";
import { Repository } from "typeorm";
import { OrmRepository } from "typeorm-typedi-extensions";
import * as moment from "moment";
import { Punch } from "../entity/punch";
import { User } from "../entity/user";
import { YearPunch } from "../entity/yearpunch";
import { MonthPunch } from "../entity/monthpunch";
import { WeekPunch } from "../entity/weekpunch";
import { DayPunch } from "../entity/daypunch";
import { PunchRequestParams } from "../viewmodel/punch.requestparams";

const cm = Container.get(ConnectionManager);

@Service()
export class PunchDomain {
    constructor() {
    }

    async punch(user: User, enter: boolean): Promise<Punch[]> {
        let punch = cm.get().getRepository(Punch).create();
        let t = this.getPunchTime();
        punch.time = t.time;
        punch.timedec = t.timedec;
        punch.direction = enter;
        punch.user = user;

        return Promise.resolve().then(() => {
            let yearPromise = cm.get().getRepository(YearPunch).findOne({ year: t.time.getFullYear() });
            let monthPromise = cm.get().getRepository(MonthPunch).findOne({ month: t.time.getMonth() + 1 });
            let weekPromise = cm.get().getRepository(WeekPunch).findOne({ week: moment(t.time).isoWeek() });
            let dayPromise = cm.get().getRepository(DayPunch).findOne({ day: t.time.getDate() });
            return Promise.all([yearPromise, monthPromise, weekPromise, dayPromise]);
        }).then((values: any[]) => {
            punch.year = values[0];
            punch.month = values[1];
            punch.week = values[2];
            punch.day = values[3];
        }).then(() => cm.get().getRepository(User).persist(user))
            .then(() => cm.get().getRepository(Punch).persist(punch))
            .then(() => this.getToday(user));
    }

    async getToday(user: User): Promise<Punch[]> {
        return cm.get().getRepository(Punch).createQueryBuilder("punch")
            .innerJoinAndSelect("punch.user", "user")
            .innerJoinAndSelect("punch.year", "year")
            .innerJoinAndSelect("punch.month", "month")
            .innerJoinAndSelect("punch.week", "week")
            .innerJoinAndSelect("punch.day", "day")
            .where("user.id = :id")
            .andWhere("year.year = :year")
            .andWhere("month.month = :month")
            .andWhere("day.day = :day")
            .setParameters({ id: user.id, year: moment().year(), month: moment().month() + 1, day: moment().date() })
            .getMany();
    }

    async getThisWeek(user: User): Promise<Punch[]> {
        return cm.get().getRepository(Punch).createQueryBuilder("punch")
            .innerJoinAndSelect("punch.user", "user")
            .innerJoinAndSelect("punch.year", "year")
            .innerJoinAndSelect("punch.month", "month")
            .innerJoinAndSelect("punch.week", "week")
            .innerJoinAndSelect("punch.day", "day")
            .where("user.id = :id")
            .andWhere("year.year = :year")
            .andWhere("week.week = :week")
            .setParameters({ id: user.id, year: moment().year(), week: moment().isoWeek() })
            .getMany();
    }

    async getThisMonth(user: User): Promise<Punch[]> {
        let date = new Date();
        return cm.get().getRepository(Punch).createQueryBuilder("punch")
            .innerJoinAndSelect("punch.user", "user")
            .innerJoinAndSelect("punch.year", "year")
            .innerJoinAndSelect("punch.month", "month")
            .innerJoinAndSelect("punch.week", "week")
            .innerJoinAndSelect("punch.day", "day")
            .where("user.id = :id")
            .andWhere("year.year = :year")
            .andWhere("month.month = :month")
            .setParameters({ id: user.id, year: moment().year(), month: moment().month() + 1 })
            .getMany();
    }

    async getThisYear(user: User): Promise<Punch[]> {
        let date = new Date();
        return cm.get().getRepository(Punch).createQueryBuilder("punch")
            .innerJoinAndSelect("punch.user", "user")
            .innerJoinAndSelect("punch.year", "year")
            .innerJoinAndSelect("punch.month", "month")
            .innerJoinAndSelect("punch.week", "week")
            .innerJoinAndSelect("punch.day", "day")
            .where("user.id = :id")
            .andWhere("year.year = :year")
            .setParameters({ id: user.id, year: moment().year() })
            .getMany();
    }

    async getByUserMonthAndYear(params: PunchRequestParams): Promise<Punch[]> {
        return cm.get().getRepository(Punch).createQueryBuilder("punch")
            .innerJoin("punch.user", "user")
            .innerJoin("punch.year", "year")
            .innerJoin("punch.month", "month")
            .innerJoin("punch.day", "day")
            .where("user.id = :id")
            .andWhere("year.year = :year")
            .andWhere("month.month = :month")
            .setParameters({ id: params.id, year: params.year, month: params.month })
            .getMany();
    }

    getPunchTime(): TimeInfo {
        let time = new Date();
        let seconds = time.getSeconds() + 60 * time.getMinutes();
        let hundreths = Math.round(seconds / 3600 * 100) / 100;
        let timedec = time.getHours() + hundreths;
        return new TimeInfo(time, timedec);
    }
}

class TimeInfo {
    constructor(public time: Date, public timedec: number) { }
}