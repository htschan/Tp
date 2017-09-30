import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx'

import { TpClient, UsersDto, SessionsDto, OpResult } from '../api.g';
import { UsersVm } from './usersVm';
import { SessionsVm } from './sessionsVm';

@Injectable()
export class AdminService {
  public usersSubject: Subject<any>;

  constructor(private tpClient: TpClient) {
    this.usersSubject = new Subject();
  }

  users: UsersVm[];
  sessions: SessionsVm[];

  getUsers(): Observable<UsersVm[]> {
    return this.tpClient.adminGetUsers()
      .map(this.mapToUsers)
      .do(data => {
        this.users = data;
        this.usersSubject.next(this.users);
        return data;
      });
  }

  getSessions(): Observable<SessionsVm[]> {
    return this.tpClient.adminGetSessions()
      .map(this.mapToSessions)
      .do(data => {
        this.sessions = data;
        this.usersSubject.next(this.users);
        return data;
      });
  }

  private mapToUsers(rawUsers: UsersDto): Array<UsersVm> {
    return rawUsers.users.map(it => new UsersVm(it))
  }

  private mapToSessions(rawSessions: SessionsDto): Array<SessionsVm> {
    return rawSessions.sessions.map(it => new SessionsVm(it))
  }
}
