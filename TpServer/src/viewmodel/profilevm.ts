import { List } from 'linqts';
import { User } from '../entity/user';

export class ProfileAdminVm {
    constructor(
        public boid: string,
        public f: string, // firstname
        public n: string, // name
        public u: string, // username
        public e: string, // email
        public r: string, // role
    ) { }
}

export class ProfileAdminVms {
    constructor(users: User[]) {
        this.profileVms = new Array();
        for (let user of users) {
            this.profileVms.push(new ProfileAdminVm(user.boid, user.firstname, user.name, user.username, user.email, user.role.name));
        }
    }
    profileVms: ProfileAdminVm[];
}