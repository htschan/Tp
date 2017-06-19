import "reflect-metadata";
import { Router, Request, Response, NextFunction } from 'express';
import { Connection, ConnectionManager } from "typeorm";
import { Container, Service } from "typedi";
import { OrmConnection } from "typeorm-typedi-extensions";
import { Punch } from "./entity/punch";
import { User } from "./entity/user";
import { PunchDomain } from "./domain/punch.domain";
import { PunchRequestParams } from "./viewmodel/punch.requestparams";
import { PunchPostParams } from "./viewmodel/punch.postparams";
import { PunchVms } from "./viewmodel/viewmodels";
import { IOpResult } from "./viewmodel/operation.result";

const cm = Container.get(ConnectionManager);
const punchRequestParams = Container.get(PunchRequestParams);
const punchPostParams = Container.get(PunchPostParams);
const punchDomain = Container.get(PunchDomain);

@Service()
export class PunchRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        let punchRepository = cm.get().getRepository(Punch);
        punchRepository.find({
            alias: "punch",
            innerJoinAndSelect: {
                "user": "punch.user"
            }
        })
            .then(punches => {
                res.send(punches);
            })
            .catch(() => {
                res.status(404).send({ message: 'Nothing found', status: res.status });
            });
    }

    public async getToday(req: Request, res: Response, next: NextFunction) {
        let repository = cm.get().getRepository(User);
        repository.createQueryBuilder('user')
            .where("user.username = :username")
            .setParameters({ username: (<any>req).decoded.username })
            .getOne()
            .then(user => {
                if (user) {
                    return punchDomain.getToday(user);
                }
                else
                    Promise.reject({ message: 'User not found', status: 404 });
            })
            .then(punches => {
                let punchVms: PunchVms = new PunchVms(punches);
                res.status(200).send({ message: 'Success', status: res.status, data: punchVms.xVms });
            })
            .catch(errmsg => {
                res.status(errmsg.status).send({ success: false, result: errmsg } as IOpResult);
            });
    }

    public async getThisWeek(req: Request, res: Response, next: NextFunction) {
        let repository = cm.get().getRepository(User);
        repository.createQueryBuilder('user')
            .where("user.username = :username")
            .setParameters({ username: (<any>req).decoded.username })
            .getOne()
            .then((user) => {
                if (user) {
                    return punchDomain.getThisWeek(user);
                }
                else
                    Promise.reject({ message: 'User not found', status: 404 });
            })
            .then(punches => {
                let punchVms: PunchVms = new PunchVms(punches);
                res.status(200).send({ message: 'Success', status: res.status, data: punchVms.xVms });
            })
            .catch((errmsg) => {
                res.status(errmsg.status).send({ success: false, result: errmsg } as IOpResult);
            });
    }

    public async getThisMonth(req: Request, res: Response, next: NextFunction) {
        let repository = cm.get().getRepository(User);
        repository.createQueryBuilder('user')
            .where("user.username = :username")
            .setParameters({ username: (<any>req).decoded.username })
            .getOne()
            .then((user) => {
                if (user) {
                    return punchDomain.getThisMonth(user);
                }
                else
                    Promise.reject({ message: 'User not found', status: 404 });
            })
            .then(punches => {
                let punchVms: PunchVms = new PunchVms(punches);
                res.status(200).send({ message: 'Success', status: res.status, data: punchVms.xVms });
            })
            .catch((errmsg) => {
                res.status(errmsg.status).send({ success: false, result: errmsg } as IOpResult);
            });
    }

    public async getThisYear(req: Request, res: Response, next: NextFunction) {
        let repository = cm.get().getRepository(User);
        repository.createQueryBuilder('user')
            .where("user.username = :username")
            .setParameters({ username: (<any>req).decoded.username })
            .getOne()
            .then((user) => {
                if (user) {
                    return punchDomain.getThisYear(user);
                }
                else
                    Promise.reject({ message: 'User not found', status: 404 });
            })
            .then(punches => {
                let punchVms: PunchVms = new PunchVms(punches);
                res.status(200).send({ message: 'Success', status: res.status, data: punchVms.xVms });
            })
            .catch((errmsg) => {
                res.status(errmsg.status).send({ success: false, result: errmsg } as IOpResult);
            });
    }

    public async getOne(req: Request, res: Response, next: NextFunction) {
        let id = parseInt(req.params.id);
        console.log(`getOne ${id}`);
        let punchRepository = cm.get().getRepository(Punch);
        punchRepository.findOne(punch => punch.id === id)
            .then(punch => {
                res.status(200).send({ message: 'Success', status: res.status, punch });
            })
            .catch((err) => {
                res.status(404).send({ message: 'No punch found with the given id.', status: res.status });
            });
    }

    public async getByUserMonthYear(req: Request, res: Response, next: NextFunction) {
        punchRequestParams.validate(req)
            .then((params: PunchRequestParams) => {
                return punchDomain.getByUserMonthAndYear(params);
            })
            .then(punches => {
                res.status(200).send({ message: 'Success', status: res.status, punches });
            })
            .catch((errmsg) => {
                res.status(errmsg.status).send(errmsg);
            });
    }

    public async punch(req: Request, res: Response, next: NextFunction) {
        punchPostParams.validate(req)
            .then((params: PunchPostParams) => {
                let repository = cm.get().getRepository(User);
                console.log(`punch user ${(<any>req).decoded.username} `);
                return repository.createQueryBuilder('user')
                    .where("user.username = :username")
                    .setParameters({ username: (<any>req).decoded.username })
                    .getOne();
            })
            .then((user: User) => {
                if (user)
                    return punchDomain.punch(user, req.params.dir.toLowerCase() === "in");
                return Promise.reject({ status: 404, message: "user not found" });
            })
            .then((punches: Punch[]) => {
                let punchVms: PunchVms = new PunchVms(punches);
                res.status(200).send({ message: 'Success', status: res.status, data: punchVms.xVms });
            })
            .catch((errmsg) => {
                res.status(404).send({ success: false, result: errmsg } as IOpResult);
            });
    }

    init() {
        this.router.get('/', this.getAll);
        this.router.get('/today', this.getToday);
        this.router.get('/thisweek', this.getThisWeek);
        this.router.get('/thismonth', this.getThisMonth);
        this.router.get('/thisyear', this.getThisYear);
        this.router.post('/punch/:dir', this.punch);
        this.router.get('/:id', this.getOne);
        this.router.get('/:id/:year/:month', this.getByUserMonthYear);
    }
}

// Create the PunchRouter, and export its configured Express.Router
const routes = new PunchRouter();
routes.init();

export default routes.router;
