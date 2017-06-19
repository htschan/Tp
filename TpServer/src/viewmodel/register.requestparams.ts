import { Request } from 'express';
import { validate, Contains, Length, IsEmail } from "class-validator";



export class RegisterRequestParams {

    @Length(1, 80)
    firstname: string;
    @Length(1, 80)
    name: string;
    @IsEmail()
    @Length(1, 160)
    email: string;
    @Length(1, 80)
    username: string;
    @Length(1, 80)
    password: string;

    async validate(req: Request): Promise<{}> {
        this.firstname = req && req.body && req.body.firstname;
        this.name = req && req.body && req.body.name;
        this.email = req && req.body && req.body.email;
        this.username = req && req.body && req.body.username;
        this.password = req && req.body && req.body.password;
        return validate(this).then((errors) => {
            if (errors.length > 0) {
                return Promise.reject({ message: 'Invalid parameter.', extmsg: errors, status: 404 });
            }
            else {
                return Promise.resolve(this);
            }
        })
    }
}