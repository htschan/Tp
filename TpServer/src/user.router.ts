import { Router, Request, Response, NextFunction } from "express";
import { ConnectionManager } from "typeorm";
import { Container } from "typedi";
import { User } from "./entity/user";
import { Punch } from "./entity/punch";
import { PunchVms } from "./viewmodel/viewmodels";
import { UserRequestParams } from "./viewmodel/user.requestparams";

const cm = Container.get(ConnectionManager);
const userRequestParams = Container.get(UserRequestParams);

export class UserRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        let userRepository = cm.get().getRepository(User);
        userRepository.find()
            .then((users) => {
                res.status(200).send({ message: "Success", status: res.status, users });
            })
            .catch((err) => {
                res.status(404).send({ message: "Internal error occured.", status: res.status });
            });
    }

    public async getOne(req: Request, res: Response, next: NextFunction) {
        userRequestParams.validate(req)
            .then((params: UserRequestParams) => {
                let userRepository = cm.get().getRepository(User);
                return userRepository.createQueryBuilder("user")
                    .where("user.boid = :boid")
                    .leftJoinAndSelect("user.punches", "punches")
                    .leftJoin("punches.year", "year")
                    .leftJoin("punches.month", "month")
                    .andWhere("year.year = :year")
                    .andWhere("month.month = :month")
                    .leftJoinAndSelect("punches.day", "day")
                    .setParameters({ boid: params.boid })
                    .setParameters({ year: params.year })
                    .setParameters({ month: params.month })
                    .getOne();
            })
            .then((result: User) => {
                if (result === undefined) {
                    return Promise.reject({ message: "No User found with the given id.", status: 404 });
                }
                let punchVms: PunchVms = new PunchVms(result.punches);
                res.status(200).send({ message: "Success", status: res.status, data: punchVms.xVms });
            }).catch((errmsg) => {
                res.status(errmsg.status).send(errmsg);
            });
    }

    init() {
        this.router.get("/", this.getAll);
        this.router.get("/:boid/:year/:month", this.getOne);
        this.router.post("/:boid", this.getOne);
    }

}

// create the ProfileRouter, and export its configured Express.Router
const routes = new UserRouter();
routes.init();

export default routes.router;
