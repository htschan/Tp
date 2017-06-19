import * as uuid from "node-uuid";
import * as moment from "moment";
import { Connection } from "typeorm";
import { Container } from "typedi";
import { Punch } from "./entity/punch";
import { User } from "./entity/user";
import { Role } from "./entity/role";
import { YearPunch } from "./entity/yearpunch";
import { MonthPunch } from "./entity/monthpunch";
import { WeekPunch } from "./entity/weekpunch";
import { DayPunch } from "./entity/daypunch";
import { AuthDomain } from "./domain/auth.domain";
import { TpServerConfig } from "./timepuncher-variables-server";

const authDomain = Container.get(AuthDomain);

export class DatabaseInitializer {

    async init(connection: Connection): Promise<any> {
        let userRepo = connection.getRepository(User);
        let yearRepo = connection.getRepository(YearPunch);
        let monthRepo = connection.getRepository(MonthPunch);
        let weekRepo = connection.getRepository(WeekPunch);
        let dayRepo = connection.getRepository(DayPunch);
        let punchRepo = connection.getRepository(Punch);
        return userRepo.find().then(all => {
            if (all.length > 0) {
                return Promise.reject("Database already initialised");
            }
            return Promise.resolve();
        }).then(() => {
            console.log("create roles");
            let roleRepo = connection.getRepository(Role);
            let adminRole = roleRepo.create();
            adminRole.name = 'Admin';
            adminRole.description = 'Administrator';
            adminRole.users = new Array();
            let p1 = roleRepo.persist(adminRole);
            let userRole = roleRepo.create();
            userRole.name = 'User';
            userRole.description = 'A normal user';
            userRole.users = new Array();
            let p2 = roleRepo.persist(userRole);
            return Promise.all([userRole, adminRole, p1, p2]);
        }).then((values: any[]) => {
            console.log("create users");
            let userRole = values[0];
            let adminRole = values[1];
            let all = [];
            for (let i = 1; i < 6; i++) {
                let user = userRepo.create();
                user.boid = uuid.v4();
                user.email = `User${i}@sorawit.ch`;
                user.firstname = `Firstname ${i}`;
                user.name = `Surname ${i}`;
                user.username = `User ${i}`;
                user.salt = authDomain.createPasswordSalt();
                user.password = authDomain.encryptPassword(TpServerConfig.userpassword, user.salt);
                user.locked = false;
                user.loginattempts = 0;
                user.confirmationpending = false;
                user.role = userRole;
                userRole.users.push(user);
                all.push(userRepo.persist(user));
            }
            let admin = userRepo.create();
            admin.boid = uuid.v4();
            admin.email = `admin@sorawit.ch`;
            admin.firstname = `Firstname`;
            admin.name = `Surname`;
            admin.username = `admin`;
            admin.salt = authDomain.createPasswordSalt();
            admin.password = authDomain.encryptPassword(TpServerConfig.adminpassword, admin.salt);
            admin.locked = false;
            admin.loginattempts = 0;
            admin.confirmationpending = false;
            admin.role = adminRole;
            adminRole.users.push(admin);
            all.push(userRepo.persist(admin));

            let yearRepo = connection.getRepository(YearPunch);
            for (let y = 2015; y < 2035; y++) {
                let year = yearRepo.create();
                year.year = y;
                all.push(yearRepo.persist(year));
            }
            let monthRepo = connection.getRepository(MonthPunch);
            for (let m = 1; m < 13; m++) {
                let month = monthRepo.create();
                month.month = m;
                all.push(monthRepo.persist(month));
            }
            let weekRepo = connection.getRepository(WeekPunch);
            for (let w = 1; w < 54; w++) {
                let week = weekRepo.create();
                week.week = w;
                all.push(weekRepo.persist(week));
            }
            let dayRepo = connection.getRepository(DayPunch);
            for (let d = 1; d < 32; d++) {
                let day = dayRepo.create();
                day.day = d;
                all.push(dayRepo.persist(day));
            }
            return Promise.all(all);
        }).then(() => {
            let allUsers = userRepo.find();
            let allYears = yearRepo.find();
            let allMonths = monthRepo.find();
            let allWeeks = weekRepo.find();
            let allDays = dayRepo.find();
            return Promise.all([allUsers, allYears, allMonths, allWeeks, allDays]);
        }).then((values: any[]) => {
            console.log("create punches");
            let allUsers: User[] = values[0];
            let allYears: YearPunch[] = values[1];
            let allMonths: MonthPunch[] = values[2]
            let allWeeks: WeekPunch[] = values[3];
            let allDays: DayPunch[] = values[4];

            let weekday = 4; // Thursday 1.1.2015
            for (let year of allYears) {
                if (year.year > 2016)
                    continue;
                console.log(`year ${year.year}`);
                for (let month of allMonths) {
                    console.log(`  month ${month.month}`);
                    for (let day of allDays) {
                        let weekdaynum = moment(new Date(year.year, month.month, day.day)).isoWeek();
                        weekRepo.findOne({ week: weekdaynum })
                            .then((weekOfYear) => {
                                if (this.isWorkday(weekday, day, month)) { // between Monday and Friday
                                    for (let user of allUsers) {
                                        for (let s = 1; s < 5; s++) {
                                            let punch = punchRepo.create();
                                            let t = this.getPunchTime(s);
                                            punch.time = t.time;
                                            punch.timedec = t.timedec;
                                            punch.direction = !this.isEven(s);
                                            punch.year = year;
                                            punch.month = month;
                                            punch.week = weekOfYear;
                                            punch.day = day;
                                            punch.user = user;
                                            punchRepo.persist(punch);
                                        }
                                    }
                                }
                                if (weekday > 6)
                                    weekday = 1;
                                else
                                    weekday++;
                            });
                    }
                }
            }

            yearRepo.persist(allYears)
                .then(() => { return monthRepo.persist(allMonths) })
                .then(() => { return weekRepo.persist(allWeeks) })
                .then(() => { return dayRepo.persist(allDays) })
                .then(() => { return userRepo.persist(allUsers) })
                .then(() => console.log("Database initialized"))
                .then(() => { return Promise.resolve("success"); });
        });
    }

    isWorkday(weekDay: number, day: DayPunch, month: MonthPunch): boolean {
        if (weekDay < 6 && day.day <= this.getMonthDays(month.month)) {
            if (day.day > 24 && month.month === 12)
                return false;
            if (day.day < 3 && month.month === 1)
                return false;
            if (day.day < 2 && month.month === 8)
                return false;
            return true;
        }
        return false;
    }

    getMonthDays(month: number): number {
        let marr = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (month > 0 && month < 14)
            return marr[month];
        else
            return marr[month];
    }

    getPunchTime(s: number): TimeInfo {
        let t = [0, 7, 11, 12, 16];
        let hour = Math.floor((Math.random() * 2) + 0) + t[s];
        let hourhundreths = Math.floor((Math.random() * 99) + 0);
        let x = hourhundreths * 60 / 100;
        let remainder = x - Math.floor(x);
        let time = new Date(0, 0, 0, hour, hourhundreths * 60 / 100, remainder * 3600 / 100);
        return new TimeInfo(time, (hour * 100 + hourhundreths) / 100);
    }

    isEven(n): boolean {
        return n % 2 == 0;
    }
}

class TimeInfo {
    constructor(public time: Date, public timedec: number) { }
}