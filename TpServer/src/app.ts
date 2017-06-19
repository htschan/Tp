import "reflect-metadata";
import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as fs from 'fs';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as jwt from 'jsonwebtoken';
import * as swaggerUi from 'swagger-ui-express';
import { Container, Inject } from "typedi";
import HeroRouter from './hero.router';
import PunchRouter from './punch.router';
import UserRouter from './user.router';
import ProfileRouter from './profile.router';
import AuthRouter from './auth.router';
import RegisterRouter from './register.router';
import { TpServerConfig } from "./timepuncher-variables-server";
import { databaseConfig } from "./connection.config";
import { DatabaseInitializer } from "./database.initializer";

import { createConnection, useContainer, ConnectionManager } from "typeorm";

const swaggerDocument = require('./swagger');
const cm = Container.get(ConnectionManager);
const unprotectedRoutes: string[] = ['/api/v1/authenticate', '/api/v1/register', '/api/v1/heroes', '/api-docs']; // includes '/'

// Creates and configures an ExpressJS web server.
class App {

    @Inject()
    dbInitializer: DatabaseInitializer;

    // ref to Express instance
    public express: express.Application;

    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.express.set('superSecret', TpServerConfig.secret);
        useContainer(Container);
        this.database();
        this.middleware();
        this.routes();
    }

    private database() {
        cm.createAndConnect(databaseConfig)
            .then(connection => {
                // here you can start to work with your entities
                return this.dbInitializer.init(connection);
            })
            .catch(error => {
                console.log(error);
            });
    }

    // Configure Express middleware.
    private middleware(): void {
        // create a write stream (in append mode)
        let accessLogStream = fs.createWriteStream(path.join(__dirname, 'tpserver.access.log'), { flags: 'a' })
        this.express.use(logger('combined', { stream: accessLogStream }));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(cors());
        this.express.use(this.authenticate(unprotectedRoutes));
    }

    // Configure API endpoints.
    private routes(): void {
        /* This is just to get up and running, and to make sure what we've got is
         * working so far. This function will change when we start to add more
         * API endpoints */
        let router = express.Router();
        // placeholder route handler
        router.get('/', (req, res, next) => {
            res.json({
                message: 'Hello, this is Timepuncher Server!'
            });
        });
        router.get('/loginfailed', (req, res, next) => {
            res.json({
                message: 'Hi, sorry the login failed!'
            });
        });
        this.express.use('/', router);
        this.express.use('/api/v1/authenticate', AuthRouter);
        this.express.use('/api/v1/register', RegisterRouter);
        this.express.use('/api/v1/punches', PunchRouter);
        this.express.use('/api/v1/users', UserRouter);
        this.express.use('/api/v1/profiles', ProfileRouter);
        this.express.use('/api/v1/heroes', HeroRouter);
        this.express.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    private authenticate(unprotectedRoutes: string[]): express.RequestHandler {
        let router = express.Router();
        let _this = this;

        return router.use(function (req, res, next) {
            // pass through unprotected routes
            if (req.path === '/') {
                next();
                return;
            }
            for (let s of unprotectedRoutes) {
                if (req.path.startsWith(s)) {
                    next();
                    return;
                }
            }

            // check header or url parameters or post parameters for token
            var token = req.body.token || req.query.token || req.headers['x-access-token'];
            if (token) {
                jwt.verify(token, _this.express.get('superSecret'), function (err, decoded) {
                    if (err) {
                        return res.json({ success: false, message: 'Failed to verify token' });
                    } else {
                        // if everything is good, save to request for use in other routes
                        console.log("authenticated " + decoded.username);
                        (<any>req).decoded = decoded;
                        next();
                    }
                })
            } else {
                // if there is no token
                // return an error
                return res.status(403).send({
                    success: false,
                    message: 'No token provided.'
                });
            }
        })
    }
}
export default Container.get(App).express;

