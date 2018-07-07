import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

import { TpAdminClient, UsersDto, SessionsDto, OpResult } from '../client-proxy';
import { UsersVm } from './usersVm';
import { SessionsVm } from './sessionsVm';

@Injectable()
export class AdminService {
  public usersSubject: Subject<any>;

  constructor(private tpClient: TpAdminClient) {
    this.usersSubject = new Subject();
  }

  users: UsersVm[];
  sessions: SessionsVm[];

  getUsers(): Observable<UsersVm[]> {
    return this.tpClient.getUsers()
      .map(this.mapToUsers)
      .do(data => {
        this.users = data;
        this.usersSubject.next(this.users);
        return data;
      });
  }

  getSessions(): Observable<SessionsVm[]> {
    return this.tpClient.getSessions()
      .map(this.mapToSessions)
      .do(data => {
        this.sessions = data;
        this.usersSubject.next(this.users);
        return data;
      });
  }

  private mapToUsers(rawUsers: UsersDto): Array<UsersVm> {
    return rawUsers.users.map(it => new UsersVm(it));
  }

  private mapToSessions(rawSessions: SessionsDto): Array<SessionsVm> {
    return rawSessions.sessions.map(it => new SessionsVm(it));
  }
}
