import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { ConnectionManager } from "typeorm";
import { AuthDomain } from "./domain/auth.domain";
import { RegisterRequestParams } from "./viewmodel/register.requestparams";
import { IRegisterResponse, IConfirmResponse } from "./viewmodel/register.response";
import { IOpResult } from "./viewmodel/operation.result";

const connectionManager = Container.get(ConnectionManager);
const regRequestParams = Container.get(RegisterRequestParams);
const authDomain = Container.get(AuthDomain);

export class RegisterRouter {
    router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    public async register(req: Request, res: Response, next: NextFunction) {
        regRequestParams.validate(req)
            .then((params: RegisterRequestParams) => {
                return authDomain.register(params);
            })
            .then((message) => {
                res.status(200).json({ opResult: { success: true, result: "Registration successful ! Check your e-mail for a confirmation link." } } as IRegisterResponse);
            })
            .catch((errmsg) => {
                res.status(errmsg.status).send({ success: false, result: errmsg } as IOpResult);
            });
    }

    public async confirm(req: Request, res: Response, next: NextFunction) {
        let authDomain = Container.get(AuthDomain);
        authDomain.confirmtoken(req.query.confirmation)
            .then(() => {
                res.status(200).json({ opResult: { success: true, result: "Confirmation successful, you can now login !" } } as IConfirmResponse);
            }).catch(() => {
                res.status(404).send({ success: false, result: { status: res.status, message: 'Confirmation failed.' } } as IOpResult);
            });
    }

    init() {
        this.router.post('/', this.register);
        this.router.get('/confirm', this.confirm);
    }
}

// Create the RegisterRouter, and export its configured Express.Router
const routes = new RegisterRouter();
routes.init();

export default routes.router;

