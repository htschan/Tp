// src/services/auth/auth.service.ts

import { Headers, Http } from '@angular/http';
import { Storage } from '@ionic/storage';
// import { Events } from 'ionic-angular';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TpClientConfig } from '../../timepuncher-client-config';
import { TpClient, AuthResponse, CredentialDto, RefreshTokenDto, UsersDto, UserDto, RoleDto } from '../../services/api.g';

const registerUrl: string = `${TpClientConfig.baserurl}api/v1/accounts`;

export enum RoleEnum { UserRole, AdminRole, PowerRole }

@Injectable()
export class AuthService {

    jwtHelper: JwtHelper = new JwtHelper();
    refreshSubscription: any;
    userProfile: Object;
    zoneImpl: NgZone;
    idToken: string;
    initialized = false;

    constructor(private tpClient: TpClient, zone: NgZone/*, public events: Events*/, private http: Http, private storage: Storage) {
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
                    : this.initialized ? Promise.resolve(tokenNotExpired('id_token', token)) : this.getNewJwt();
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

    public puGetUsers(): Observable<UsersVm> {
        return this.tpClient.puGetUsers().map(usersResponse => {
            return new UsersVm(usersResponse);
        })
    }

    public hasRole(role: RoleEnum): Promise<boolean> {
        return this.getToken()
            .then(token => {
                let roleName = "";
                switch (role) {
                    case RoleEnum.UserRole:
                        roleName = "api_access";
                        break;
                    case RoleEnum.PowerRole:
                        roleName = "api_access_power";
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
        return this.tpClient.authenticate({ "username": username, "password": password, client_type: "web" } as CredentialDto)
            .do(data => {
                this.storeAuth(data)
                    .then(() =>
                        this.startupTokenRefresh())
                    .catch(() => {
                        this.logout();
                        throw data;
                    });
                // this.events.publish('user:login');
                // return this.getMyProfile();
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
                    // this.events.publish('user:signup');
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
        // this.events.publish('user:logout');
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

export class RoleVm {

    name?: string | undefined;

    constructor(dto: RoleDto) {
        this.setRole(dto);
    }

    setRole(dto: RoleDto) {
        this.name = dto.name;
    }
}

export class UserVm {

    /** Then user id */
    id?: string | undefined;
    /** The first name of user */
    firstName?: string | undefined;
    /** The last name of user */
    lastName?: string | undefined;
    /** The email of the user */
    email?: string | undefined;
    /** The confirmed status of the user registration */
    emailConfirmed?: boolean | undefined;
    /** The number of failed access attempts */
    accessFailedCount?: number | undefined;
    roleNames?: RoleVm[] | undefined;

    constructor(dto: UserDto) {
        this.setUser(dto);
    }

    setUser(dto: UserDto) {
        this.id = dto.id;
        this.firstName = dto.firstName;
        this.lastName = dto.lastName;
        this.email = dto.email;
        this.emailConfirmed = dto.emailConfirmed;
        this.accessFailedCount = dto.accessFailedCount;
        this.roleNames = [];
        for (let role of dto.roleNames) {
            this.roleNames.push(new RoleVm(role))
        }
    }
}

export class UsersVm {

    users?: UserVm[] | undefined;

    constructor(dto: UsersDto) {
        this.setUser(dto);
    }

    setUser(dto: UsersDto) {
        this.users = [];
        for (let user of dto.users) {
            this.users.push(new UserVm(user))
        }
    }
}
