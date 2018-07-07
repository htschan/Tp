import { SessionDto } from '../client-proxy';

export class SessionsVm {
  selected: boolean;
  id: string;
  userid: string;
  email: string;
  created: string;
  isStop: boolean;

  constructor(session: SessionDto) {
    this.selected = false;
    this.id = session.id;
    this.userid = session.userid;
    this.email = session.email;
    this.created = session.created;
    this.isStop = session.isStop;
  }
}
