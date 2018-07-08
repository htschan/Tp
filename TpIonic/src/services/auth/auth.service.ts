// src/services/auth/auth.service.ts

import { Headers, Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TpClientConfig } from '../../timepuncher-client-config';
import { TpUserClient, TpProfilesClient, AuthResponse, CredentialDto, RefreshTokenDto, ProfileResponseDto } from '../../app/services/client-proxy';

const registerUrl: string = `${TpClientConfig.baserurl}api/v1/accounts`;

export enum RoleEnum { UserRole, AdminRole }

@Injectable()
export class AuthService {

    jwtHelper: JwtHelperService = new JwtHelperService();
    refreshSubscription: any;
    userProfile: ProfileVm;
    zoneImpl: NgZone;
    idToken: string;
    initialized = false;

    constructor(private tpClient: TpUserClient, private tpProfileClient: TpProfilesClient,
        zone: NgZone, public events: Events, private http: Http, private storage: Storage) {
        this.zoneImpl = zone;
        storage.ready()
            // Check if there is a profile saved in storage
            .then(() => this.storage.get('profile')
                .then(profile => {
                    this.userProfile = JSON.parse(profile);
                }))
            .then(() => {
                this.getToken().then(token => {
                    this.getNewJwt().then(() => {
                        this.initialized = true;
                        this.idToken = token;
                        if (this.idToken)
                            this.startupTokenRefresh();
                    });
                });
            });
    }

    public getAuthenticated(): Promise<boolean> {
        return this.getToken()
            .then(token => {
                return token === null ? Promise.resolve(false)
                    : this.initialized ? Promise.resolve(!this.jwtHelper.isTokenExpired(token)) : this.getNewJwt();
            })
            .catch(() => { return Promise.resolve(false); });
    }

    public getMyProfile(): Observable<ProfileVm> {
        return this.tpProfileClient.myprofile()
            .map(data => {
                return new ProfileVm(data);
            })
            .do(profileVm => {
                this.storage.set("profile", JSON.stringify(profileVm));
            });
    }

    public hasRole(role: RoleEnum): Promise<boolean> {
        return this.getToken()
            .then(token => {
                let roleName = "";
                switch (role) {
                    case RoleEnum.UserRole:
                        roleName = "api_access";
                        break;
                    case RoleEnum.AdminRole:
                        roleName = "api_access_admin";
                        break;
                }
                let decodedToken = this.jwtHelper.decodeToken(token);
                let roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                if (roles.indexOf(roleName) >= 0) {
                    return Promise.resolve(true);
                }
                return Promise.resolve(false);
            })
            .catch(() => { return Promise.resolve(false); });
    }

    public getToken(): Promise<string> {
        return this.storage.get('id_token');
    }

    public login(username: string, password: string): Observable<AuthResponse> {
        if (username === null || password === null) {
            return Observable.throw("Bad credentials");
        }
        return this.tpClient.authenticate({ "username": username, "password": password, client_type: "web" } as CredentialDto)
            .do(data => {
                this.storeAuth(data)
                    .then(() => {
                        this.startupTokenRefresh();
                        this.getMyProfile().take(1).subscribe(data => {
                            this.userProfile = data;
                        });
                    })
                    .catch(() => {
                        this.logout();
                        throw data;
                    });
            });
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
        this.getAuthenticated().then(authenticated => {
            let source = Observable.of(this.idToken).flatMap(
                token => {
                    // Get the expiry time to generate
                    // a delay in milliseconds
                    let now: number = new Date().valueOf();
                    let decoded = this.jwtHelper.decodeToken(token);
                    let jwtExp: number = decoded.exp;
                    let exp: Date = new Date(0);
                    exp.setUTCSeconds(jwtExp);
                    let delay: number = exp.valueOf() - now;
                    this.events.publish('user:login', decoded.nameid, Date.now());

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
        })
    }

    public unscheduleRefresh() {
        // Unsubscribe fromt the refresh
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }

    public getNewJwt(): Promise<boolean> {
        // Get a new JWT using the refresh token saved
        // in storage
        return this.storage.get('refresh_token').then(token => {
            let refreshTokenDto = new RefreshTokenDto();
            refreshTokenDto.init({ refresh_token: token });
            return this.tpClient.refreshtoken(refreshTokenDto)
                .do(response => this.storeAuth(response))
                .map(response => response !== null)
                .toPromise()
        }).catch(error => {
            console.log(error);
            return Promise.reject("error");
        });
    }

    private storeAuth(authInfo: AuthResponse): Promise<string> {
        if (authInfo instanceof AuthResponse && authInfo.status.success) {
            return Promise.all([
                this.storage.set('id_token', authInfo.token),
                this.storage.set('refresh_token', authInfo.refreshtoken)
            ]).then(() => this.idToken = authInfo.token);
        }
        // else
        //     return Promise.reject("storeAuth failed");
    }
}

export class ProfileVm {
    constructor(dto: ProfileResponseDto) {
        this.setProfile(dto);
    }

    setProfile(dto: ProfileResponseDto) {
        this.id = dto.id;
        this.pictureUrl = dto.pictureUrl;
        this.email = dto.user.email;
        this.firstName = dto.user.firstName;
        this.lastName = dto.user.lastName;
    }

    id?: string;
    pictureUrl?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
}