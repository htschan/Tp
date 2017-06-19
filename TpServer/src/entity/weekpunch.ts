import { Table, Column, PrimaryGeneratedColumn, OneToMany, Index, VersionColumn } from "typeorm";
import { Punch } from './punch';
@Table()
export class WeekPunch {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    @Index()
    week: number;
    @OneToMany(type => Punch, punch => punch.week) // note: we will create author property in the Punch class below
    punches: Punch[];
    @VersionColumn()
    version: number;
}