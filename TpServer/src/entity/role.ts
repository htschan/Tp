import { Table, Column, PrimaryGeneratedColumn, OneToMany, VersionColumn } from "typeorm";
import { User } from './user';
@Table()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    description: string;
    @OneToMany(type => User, user => user.role)
    users: User[];
    @VersionColumn()
    version: number;
}