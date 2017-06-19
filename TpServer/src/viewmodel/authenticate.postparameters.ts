import { Request } from 'express';
import { validate, MinLength, IsAscii } from "class-validator";

export class AuthPostParams {

    @IsAscii()
    @MinLength(1)
    username: string;
    @IsAscii()
    password: string;

    async validate(req: Request): Promise<{}> {
        this.username = req && req.headers && req.headers['username'] || "";
        this.password = req && req.headers && req.headers['password'] || "";
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