import { Request } from 'express';
import { validate, IsUUID } from "class-validator";

export class ProfileRequestParams {

    @IsUUID()
    boid: number;

    async validate(req: Request): Promise<{}> {
        this.boid = req && req.params && req.params.boid;
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
