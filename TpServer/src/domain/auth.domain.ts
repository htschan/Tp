import * as uuid from "node-uuid";
import { randomBytes, createHmac } from "crypto";
import * as jwt from 'jsonwebtoken';
import express from "../app";
import { ConnectionManager } from "typeorm";
import { Container, Service } from "typedi";
import { Repository } from "typeorm";
import { OrmRepository } from "typeorm-typedi-extensions";
import { User } from "../entity/user";
import { Role } from "../entity/role";
import { MailerDomain } from "./mailer.domain";
import { RegisterRequestParams } from "../viewmodel/register.requestparams";
import { AuthPostParams } from "../viewmodel/authenticate.postparameters";
import { ProfileAdminVms, ProfileAdminVm } from "../viewmodel/profilevm";

const cm = Container.get(ConnectionManager);

@Service()
export class AuthDomain {
    constructor() {
    }

    async register(params: RegisterRequestParams): Promise<any> {
        // verify unique username and email
        let userRepository = cm.get().getRepository(User);
        return userRepository.createQueryBuilder("user")
            .where("username = :username")
            .setParameters({ username: params.username })
            .getOne()
            .then(user => { // check user exists
                if (user !== undefined)
                    return Promise.reject({ message: 'Registration failed: Bad username.', status: 404 });
            })
            .then(() => {
                return userRepository.createQueryBuilder("email")
                    .where("email = :email")
                    .setParameters({ email: params.email })
                    .getOne()
                    .then(user => { // check email exists
                        if (user !== undefined)
                            return Promise.reject({ message: 'Registration failed: Bad email.', status: 404 });
                    })
            })
            .then(() => {
                // if user and email do not exist, create a user and set confirmation pending
                let authDomain = Container.get(AuthDomain);
                return authDomain.createUser(params).then((user) => {
                    return Promise.resolve('Registration successful, go to your mailbox and confirm registration!');
                })
            })
    }

    async authenticate(params: AuthPostParams): Promise<any> {
        let userRepository = cm.get().getRepository(User);
        return userRepository.createQueryBuilder("user")
            .where("user.username = :username")
            .leftJoinAndSelect("user.role", "role")
            .setParameters({ username: params.username })
            .getOne()
            .then(user => {
                if (user === undefined)
                    return Promise.reject({ message: 'Authentication failed: Username or Password wrong.', status: 404 })
                if (user.confirmationpending === true) {
                    return Promise.reject({ message: 'Authentication failed: E-Mail confirmation still pending.', status: 404 });
                }
                if (user.locked === true) {
                    return Promise.reject({ message: 'Authentication failed: Account is locked.', status: 404 });
                }
                if (!this.verifyPassword(params.password, user)) {
                    this.incrementPasswordFailCounter(user);
                    return Promise.reject({ message: 'Authentication failed: Username or Password wrong.', status: 404 });
                }
                // if user is found and password is right then reset fail counter
                this.resetPasswordFailCouter(user);
                // create a token
                var token = jwt.sign({ username: user.username, roles: [user.role.name] }, express.get('superSecret'), {
                    expiresIn: 1440 // expires in 24 hours
                });
                return Promise.resolve(token);
            });
    }

    async getAllAdminProfiles(username: string): Promise<any> {
        let userRepository = cm.get().getRepository(User);
        return this.isAdmin(username)
            .then(isAdmin => {
                if (isAdmin) {
                    return userRepository.find()
                        .then((users: User[]) => {
                            return Promise.resolve(new ProfileAdminVms(users));
                        })
                }
                else
                    return Promise.reject({ status: 404, message: "Access denied" });
            })
    }

    async getMyProfile(username: string): Promise<any> {
        let userRepository = cm.get().getRepository(User);
        return userRepository.createQueryBuilder('user')
            .where("user.username = :username")
            .leftJoinAndSelect("user.role", "role")
            .setParameters({ username: username })
            .getOne()
            .then((user: User) => {
                return Promise.resolve(new ProfileAdminVms([user]));
            });
    }

    async isAdmin(username: string): Promise<boolean> {
        let userRepository = cm.get().getRepository(User);
        return userRepository.createQueryBuilder("user")
            .where("user.username = :username")
            .leftJoinAndSelect("user.role", "role")
            .setParameters({ username: username })
            .getOne()
            .then((result) => {
                return Promise.resolve(result.role.name === "Admin");
            });
    }

    async createUser(userReq: RegisterRequestParams): Promise<User> {
        let userRepository = cm.get().getRepository(User);
        return cm.get().getRepository(Role)
            .createQueryBuilder("role")
            .where("name = 'User'")
            .getOne()
            .then((userRole) => {
                let user = userRepository.create();
                user.boid = uuid.v1();
                user.email = userReq.email;
                user.firstname = userReq.firstname;
                user.name = userReq.name;
                user.username = userReq.username;
                user.salt = this.createPasswordSalt();
                user.password = this.encryptPassword(userReq.password, user.salt);
                user.locked = false;
                user.loginattempts = 0;
                user.confirmationpending = true;
                user.confirmationtoken = this.createConfirmationToken();
                user.role = userRole;
                return userRepository.persist(user);
            })
            .then(user => {
                // send e-email
                console.log("sending mail");
                let mailer = Container.get(MailerDomain);
                mailer.sendConfirmationMail(user.confirmationtoken);
                return user;
            });
    }

    async incrementPasswordFailCounter(user: User) {
        let userRepository = cm.get().getRepository(User);
        user.loginattempts = user.loginattempts + 1;
        if (user.loginattempts > 3)
            user.locked = true;
        return userRepository.persist(user);
    }

    async resetPasswordFailCouter(user: User) {
        let userRepository = cm.get().getRepository(User);
        user.loginattempts = 0;
        return userRepository.persist(user);
    }

    async confirmtoken(token: string): Promise<void> {
        let userRepository = cm.get().getRepository(User);
        return userRepository.createQueryBuilder("user")
            .where("confirmationtoken = :confirmtoken")
            .setParameters({ confirmtoken: token })
            .getOne()
            .then(user => {
                // confirm user
                user.confirmationpending = false;
                user.confirmationtoken = "";
                userRepository.persist(user);
            })
    }

    verifyPassword(clearPassword: string, user: User) {
        return this.encryptPassword(clearPassword, user.salt) === user.password;
    }

    encryptPassword(clearPassword: string, salt: string) {
        return createHmac('sha1', salt).update(clearPassword).digest('hex');
    }

    createPasswordSalt() {
        return randomBytes(32).toString('hex');
    }

    createConfirmationToken(): string {
        return randomBytes(48).toString('hex');
    }
}

