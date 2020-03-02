import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { AuthDomain } from "./domain/auth.domain";
import { AuthPostParams } from "./viewmodel/authenticate.postparameters";
import { IAuthResponse } from "./viewmodel/authenticate.response";
import { IOpResult } from "./viewmodel/operation.result";

const authDomain = Container.get(AuthDomain);
const authPostParams = Container.get(AuthPostParams);

export class AuthRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    async authenticate(req: Request, res: Response, next: NextFunction) {
        authPostParams.validate(req)
            .then((params: AuthPostParams) => {
                return authDomain.authenticate(params).then((token) => {
                    // return the information including token as JSON
                    res.json({ token: token, opResult: { success: true, result: "Enjoy your token !" } } as IAuthResponse);
                });
            })
            .catch((errmsg) => {
                res.status(errmsg.status).send({ success: false, result: errmsg } as IOpResult);
            });
    }

    async recoverUsername(req: Request, res: Response, next: NextFunction) {

        // validate e-mail

        // if e-mail found

        //  send e-mail and set user recoverpending and confirmtoken
        res.status(404).send({ success: false, result: "not implemented yet" } as IOpResult);
    }

    async recoverPassword(req: Request, res: Response, next: NextFunction) {

        // validate e-mail

        // if e-mail found

        //  send e-mail and set user recoverpending and confirmtoken
        res.status(404).send({ success: false, result: "not implemented yet" } as IOpResult);

    }

    init() {
        this.router.post("/", this.authenticate);
        this.router.post("/recoverUsername", this.recoverUsername);
        this.router.post("/recoverPassword", this.recoverPassword);
    }
}

// create the AuthRouter, and export its configured Express.Router
const routes = new AuthRouter();
routes.init();

export default routes.router;

