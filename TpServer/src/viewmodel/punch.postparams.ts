import { Request } from 'express';
import { validate, IsIn } from "class-validator";

export class PunchPostParams {

    @IsIn(['In', 'Out'])
    dir: string;

    async validate(req: Request): Promise<{}> {
        this.dir = req && req.params && req.params.dir || "";
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
