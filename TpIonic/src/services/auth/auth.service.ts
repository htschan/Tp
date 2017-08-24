// src/services/auth/auth.service.ts

import { Headers, Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TpClientConfig } from '../../timepuncher-client-config';
import { TpClient, AuthResponse, CredentialDto } from '../../services/api.g';

const registerUrl: string = `${TpClientConfig.baserurl}api/v1/accounts`;

@Injectable()
export class AuthService {

    jwtHelper: JwtHelper = new JwtHelper();
    refreshSubscription: any;
    userProfile: Object;
    zoneImpl: NgZone;
    idToken: string;

    constructor(private tpClient: TpClient, zone: NgZone, public events: Events, private http: Http, private storage: Storage) {
        this.zoneImpl = zone;
        storage.ready()
            // Check if there is a profile saved in local storage
            .then(() => this.storage.get('profile').then(profile => {
                this.userProfile = JSON.parse(profile);
            }));
        this.getToken().then(token => this.idToken = token);
    }

    public getAuthenticated(): Promise<boolean> {
        return this.getToken()
            .then(token => {
                return token === null ? Promise.resolve(false)
                    : Promise.resolve(tokenNotExpired('id_token', token));
            })
            .catch(() => { return Promise.resolve(false); });
    }

    public getMyProfile(): Observable<any> {
        return this.tpClient.getMyProfile()
            .map(data => {
                return data.status
            })
            .do(profileVm => {
                this.storage.set("profile", JSON.stringify(profileVm));
            });
    }

    public authenticated(): boolean {
        return tokenNotExpired('id_token');
    }

    public getToken(): Promise<string> {
        return this.storage.get('id_token');
    }

    public login(username: string, password: string): Observable<any> {
        if (username === null || password === null) {
            return Observable.throw("Bad credentials");
        }
        return this.tpClient.authenticate({ "email": username, "password": password } as CredentialDto)
            .do(data => {
                if (data instanceof AuthResponse && data.status.success) {
                    console.log('Data: ' + data);
                    this.storage.set('id_token', data.token);                    
                    this.idToken = data.token;
                    this.events.publish('user:login');
                    // return this.getMyProfile();
                } else {
                    this.logout();
                }
            },
            e => console.log("OnError " + e),
            () => console.log("Authenticate complete"));
    }

    public register(credentials): Observable<Response> {
        if (credentials.email === null || credentials.password === null) {
            return Observable.throw("Please insert credentials");
        } else {
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');
            return this.http.post(registerUrl, '', { body: credentials, headers: headers })
                .map(data => data.json())
                .do(data => {
                    this.events.publish('user:signup');
                })
        }
    }

    public logout() {
        this.storage.remove('profile');
        this.storage.remove('id_token');
        this.idToken = null;
        this.storage.remove('refresh_token');
        this.zoneImpl.run(() => this.userProfile = null);
        // Unschedule the token refresh
        this.unscheduleRefresh();
        this.events.publish('user:logout');
    }

    public scheduleRefresh() {
        // If the user is authenticated, use the token stream
        // provided by angular2-jwt and flatMap the token

        let source = Observable.of(this.idToken).flatMap(
            token => {
                console.log('token here', token);
                // The delay to generate in this case is the difference
                // between the expiry time and the issued at time
                let jwtIat = this.jwtHelper.decodeToken(token).iat;
                let jwtExp = this.jwtHelper.decodeToken(token).exp;
                let iat = new Date(0);
                let exp = new Date(0);

                let delay = (exp.setUTCSeconds(jwtExp) - iat.setUTCSeconds(jwtIat));

                return Observable.interval(delay);
            });

        this.refreshSubscription = source.subscribe(() => {
            this.getNewJwt();
        });
    }

    public startupTokenRefresh() {
        // If the user is authenticated, use the token stream
        // provided by angular2-jwt and flatMap the token
        if (this.authenticated()) {
            let source = Observable.of(this.idToken).flatMap(
                token => {
                    // Get the expiry time to generate
                    // a delay in milliseconds
                    let now: number = new Date().valueOf();
                    let jwtExp: number = this.jwtHelper.decodeToken(token).exp;
                    let exp: Date = new Date(0);
                    exp.setUTCSeconds(jwtExp);
                    let delay: number = exp.valueOf() - now;

                    // Use the delay in a timer to
                    // run the refresh at the proper time
                    return Observable.timer(delay);
                });

            // Once the delay time from above is
            // reached, get a new JWT and schedule
            // additional refreshes
            source.subscribe(() => {
                this.getNewJwt();
                this.scheduleRefresh();
            });
        }
    }

    public unscheduleRefresh() {
        // Unsubscribe fromt the refresh
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }

    public getNewJwt() {
        // Get a new JWT from Auth0 using the refresh token saved
        // in local storage
        this.storage.get('refresh_token').then(token => {
            console.log("refresh");
        }).catch(error => {
            console.log(error);
        });
    }
}