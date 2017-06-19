import { User } from './user';

export class Punch {
    id: number;
    time: string;
    direction: boolean;
    user: User;
}