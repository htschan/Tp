import { IOpResult } from './operation.result';


export class IAuthResponse {
    token: string;
    opResult: IOpResult;
}