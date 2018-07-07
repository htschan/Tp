import { UserDto } from '../client-proxy';

export class UsersVm {
  selected: boolean;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailConfirmed: boolean;
  roles: string;

  constructor(user: UserDto) {
    this.selected = false;
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.emailConfirmed = user.emailConfirmed;
    this.roles = "";
    for (const roleName of user.roleNames) {
      this.roles += roleName.name + '; ';
    }
  }
}
