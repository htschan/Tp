import { Table, Column, PrimaryGeneratedColumn, OneToMany, Index, VersionColumn } from "typeorm";
import { Punch } from './punch';
@Table()
export class MonthPunch {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    @Index()
    month: number;
    @OneToMany(type => Punch, punch => punch.month) // note: we will create author property in the Punch class below
    punches: Punch[];
    @VersionColumn()
    version: number;
}