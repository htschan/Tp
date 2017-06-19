import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { Todo } from '../model/todo';
import { Hero } from '../model/hero';
import { TpAdminConfig } from '../../../../../../timepuncher-variables-admin';

@Injectable()
export class TodoService {
  todos: any;
  thing: any;
  private heroesUrl = TpAdminConfig.serverUrl + 'api/v1/heroes';  // URL to web api

  constructor(
    private authService: AuthService,
    private http: Http,
    private authHttp: AuthHttp) {
  }

  addNewTodo(title: string, comment: string, finished: boolean = false) {
  }

  saveTodo(key: string, todo: Todo) {
  }

  getHeroes(): Promise<Hero[]> {
      this.authHttp.get(this.heroesUrl)
      .subscribe(
        data => this.thing = data,
        err => console.log(err),
        () => console.log('Request Complete')
      );
    return this.http.get(this.heroesUrl)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  getHero(id: string) {
    return this.http.get(this.heroesUrl + '/' + id)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  save(hero: Hero): Promise<Hero> {
    if (hero._id) {
      return this.put(hero);
    }
    return this.post(hero);
  }

  private post(hero: Hero): Promise<Hero> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http
      .post(this.heroesUrl, JSON.stringify(hero), { headers: headers })
      .toPromise()
      .then(response => response.json().data)
      .catch(this.handleError);
  }

  private put(hero: Hero) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let url = `${this.heroesUrl}/${hero._id}`;

    return this.http
      .put(url, JSON.stringify(hero), { headers: headers })
      .toPromise()
      .then(() => hero)
      .catch(this.handleError);
  }

  delete(hero: Hero) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let url = `${this.heroesUrl}/${hero._id}`;

    return this.http
      .delete(url, headers)
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
  
}
