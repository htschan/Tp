import { Request } from 'express';
import { validate, IsUUID, IsInt, Min, Max } from "class-validator";


export class UserRequestParams {

    @IsUUID("4")
    boid: string;

    @IsInt()
    @Min(2010)
    @Max(2030)
    year: number;

    @IsInt()
    @Min(1)
    @Max(12)
    month: number;

    async validate(req: Request): Promise<{}> {
        this.boid = req && req.params && req.params.boid;
        this.year = parseInt(req && req.params && req.params.year || 2010);
        this.month = parseInt(req && req.params && req.params.month || 1);
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
