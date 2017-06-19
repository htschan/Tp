import { Table, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, VersionColumn, Index } from "typeorm";
import { Punch } from './punch';
import { Role } from './role';
@Table()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    @Index()
    boid: string;
    @Column()
    firstname: string;
    @Column()
    name: string;
    @Column()
    email: string;
    @Column()
    username: string;
    @Column()
    password: string;
    @Column()
    locked: boolean;
    @Column("int")
    loginattempts: number;
    @Column({ nullable: true })
    lastloginattempt: Date;
    @Column()
    confirmationpending: boolean;
    @Column({ nullable: true })
    confirmationtoken: string;
    @Column()
    salt: string;
    @ManyToOne(type => Role, role => role.users)
    role: Role;
    @OneToMany(type => Punch, punch => punch.user)
    punches: Punch[];
    @CreateDateColumn()
    created: Date;
    @UpdateDateColumn()
    updated: Date;
    @VersionColumn()
    version: number;
}