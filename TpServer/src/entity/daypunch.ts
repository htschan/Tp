import { Table, Column, PrimaryGeneratedColumn, OneToMany, Index, VersionColumn } from "typeorm";
import { Punch } from './punch';
@Table()
export class DayPunch {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    @Index()
    day: number;
    @OneToMany(type => Punch, punch => punch.day) // note: we will create author property in the Punch class below
    punches: Punch[];
    @VersionColumn()
    version: number;
}