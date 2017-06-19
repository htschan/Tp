import { Table, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, ManyToOne, VersionColumn } from "typeorm";
import { User } from './user';
import { YearPunch } from './yearpunch';
import { MonthPunch } from './monthpunch';
import { WeekPunch } from './weekpunch';
import { DayPunch } from './daypunch';

@Table()
export class Punch {
    @PrimaryGeneratedColumn()
    id: number;
    @Column("time")
    time: Date;
    @Column()
    timedec: number;
    @Column()
    direction: boolean; // true: In, false: Out
    @ManyToOne(type => User, user => user.punches)
    user: User;
    @ManyToOne(type => YearPunch, year => year.punches)
    year: YearPunch;
    @ManyToOne(type => MonthPunch, month => month.punches)
    month: MonthPunch;
    @ManyToOne(type => WeekPunch, week => week.punches)
    week: WeekPunch;
    @ManyToOne(type => DayPunch, day => day.punches)
    day: DayPunch;
    @CreateDateColumn()
    created: Date;
    @UpdateDateColumn()
    updated: Date;
    @VersionColumn()
    version: number;
}