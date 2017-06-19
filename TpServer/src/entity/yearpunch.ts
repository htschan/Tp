import { Table, Column, PrimaryGeneratedColumn, OneToMany, VersionColumn } from "typeorm";
import { Punch } from './punch';
@Table()
export class YearPunch {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    year: number;
    @OneToMany(type => Punch, punch => punch.year) // note: we will create author property in the Punch class below
    punches: Punch[];
    @VersionColumn()
    version: number;
}