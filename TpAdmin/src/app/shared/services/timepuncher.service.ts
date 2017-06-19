import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from 'angular2-jwt';
import { AuthService } from './auth.service';
import { User } from '../model/user';
import { Punch } from '../model/punch';
import { TpClientConfig } from '../../../../../../timepuncher-client-config';

@Injectable()
export class TimepuncherService {
  thing: any;
  private usersUrl = TpClientConfig.baserurl + 'api/v1/users';  // URL to web api
  private punchesUrl = TpClientConfig.baserurl + 'api/v1/punches';  // URL to web api

  constructor(private authService: AuthService,
    private http: Http,
    private authHttp: AuthHttp) { }

  punchIn(): Observable<any> {
    return this.authHttp.post(`${this.punchesUrl}/punch/In`, {})
      .map(res => res.json())
      .map((data: any) => {
        return data.punches
      })
      ;
  }

  punchOut(): Observable<any> {
    return this.authHttp.post(`${this.punchesUrl}/punch/Out`, {})
      .map(res => res.json())
      .map((data: any) => {
        return data.punches
      })
      ;
  }

  getUsers(): Observable<User[]> {
    return this.authHttp.get(this.usersUrl)
      .map(res => res.json())
      .map((data: any) => { return data.users; })
  }
  getUserPunchesPerMonth(id: number, year: number, month: number): Observable<any> {
    return this.authHttp.get(`${this.usersUrl}/${id}/${year}/${month}`)
      .map(res => res.json())
      .map((envelope: any) => { return envelope.data });
  }

  test() {
    let id = 1;
    this.authHttp.get(`${this.usersUrl}/${id}`)
      .map(res => res.json())
      .map((data: any) => { debugger; return data.user })
      .map(data => { debugger; return data.punches })
      .groupBy(punch => (new Date(punch.time)).getDate())
      .flatMap(group => group.reduce((acc, curr) => [...acc, ...curr], []))
      .subscribe(data => { debugger; console.log(data) });
  }
  getPunches(): Observable<any> {
    return this.authHttp.get(`${this.punchesUrl}/2/2015/8`)
      .map(res => res.json())
      .map((data: any) => { return data.punch })
      .map((punches: any) => { return Observable.from(punches) })
      .groupBy((punch: any) => punch.day)
      .flatMap(group => group.reduce((acc, curr) => [...acc, ...curr], []))
      ;
  }
  getTodayPunches(): Observable<any> {
    return this.authHttp.get(`${this.punchesUrl}/today`)
      .map(res => res.json())
      .map((data: any) => { return data.punch })
      ;
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
