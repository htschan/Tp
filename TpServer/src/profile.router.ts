import { Router, Request, Response, NextFunction } from 'express';
import { ConnectionManager } from "typeorm";
import { Service, Container, Inject } from "typedi";
import { User } from "./entity/user";
import { PunchVms } from "./viewmodel/viewmodels";
import { ProfileAdminVms, ProfileAdminVm } from "./viewmodel/profilevm";
import { AuthDomain } from "./domain/auth.domain";
import { ProfileRequestParams } from "./viewmodel/profile.requestparams";

const cm = Container.get(ConnectionManager);
const authDomain = Container.get(AuthDomain);
const profileRequestParams = Container.get(ProfileRequestParams);

@Service()
export class ProfileRouter {
    router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        // return all AdminProfiles for admin clients, else return own profile
        let userRepository = cm.get().getRepository(User);
        authDomain.getAllAdminProfiles((<any>req).decoded.username)
            .then((profileVms: ProfileAdminVms) => {
                res.status(200).send({ message: 'Success', status: res.status, profileVms });
            })
            .catch((errmsg) => {
                res.status(errmsg.status).send(errmsg);
            });
    }

    public async getOne(req: Request, res: Response, next: NextFunction) {
        // return requested profile for admin clients, else return own profile only or nothing
        let userRepository = cm.get().getRepository(User);
        profileRequestParams.validate(req)
            .then((params: ProfileRequestParams) => {
                return authDomain.isAdmin((<any>req).decoded.username)
                    .then((isAdmin) => {
                        if (isAdmin) { // the client is Admin
                            return userRepository.createQueryBuilder('user')
                                .where("user.boid = :boid")
                                .leftJoinAndSelect("user.role", "role")
                                .setParameters({ boid: params.boid })
                                .getOne()
                        }
                        else {
                            return userRepository.createQueryBuilder('user')
                                .where("user.username = :username")
                                .leftJoinAndSelect("user.role", "role")
                                .setParameters({ username: (<any>req).decoded.username })
                                .getOne()
                        }
                    })
                    .then((user: User) => {
                        if (user === undefined)
                            return Promise.reject({ status: 404, message: "user not found" });
                        let profileVm = new ProfileAdminVm(user.boid, user.firstname, user.name, user.username, user.email, user.role.name)
                        res.status(200).send({ message: 'Success', status: res.status, profileVm });
                    })
            })
            .catch((errmsg) => {
                res.status(errmsg.status).send(errmsg);
            });
    }

    public async getMyProfile(req: Request, res: Response, next: NextFunction) {
        // return all AdminProfiles for admin clients, else return own profile
        let userRepository = cm.get().getRepository(User);
        authDomain.getMyProfile((<any>req).decoded.username)
            .then((profileVms: ProfileAdminVms) => {
                res.status(200).send({ message: 'Success', status: res.status, profileVms });
            })
            .catch((errmsg) => {
                res.status(errmsg.status).send(errmsg);
            });
    }

    init() {
        this.router.get('/', this.getAll);
        this.router.get('/myprofile', this.getMyProfile);
        this.router.get('/:boid', this.getOne);
    }
}

// Create the ProfileRouter, and export its configured Express.Router
const routes = new ProfileRouter();
routes.init();

export default routes.router;
