import { Headers, Http } from '@angular/http';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthHttp, JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TpClientConfig } from '../../../../../../timepuncher-client-config';

const authUrl: string = `${TpClientConfig.baserurl}authenticate`;
const profileUrl: string = `${TpClientConfig.baserurl}api/v1/profiles`;

@Injectable()
export class AuthService implements CanActivate {

    jwtHelper: JwtHelper = new JwtHelper();
    refreshSubscription: any;
    user: Object;
    zoneImpl: NgZone;
    idToken: string;
    userProfile: any;

    constructor(private router: Router, private authHttp: AuthHttp, zone: NgZone, private http: Http) {
        this.zoneImpl = zone;
        // Set userProfile attribute of already saved profile
        this.userProfile = JSON.parse(localStorage.getItem('profile'));
        this.idToken = localStorage.getItem('id_token');
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authenticated()) {
            let roles = next.data["roles"] as Array<string>;
            if (roles === undefined)
                return true;
            // const userRoles = req.user.roles || [];
            // const foundRoles = roles.filter(r => userRoles.some(ur => ur === r));
            // this.getProfileRoles().forEach(element => {
            //     if (roles.indexOf(element) != -1)
            //         return true;
            // });
            return true;
        } else {
            // Save URL to redirect to after login and fetching profile to get roles
            localStorage.setItem('redirect_url', state.url);
            this.router.navigate(['/auth/login']);
            return false;
        }
    }

    public getAuthenticated(): Promise<boolean> {
        return Promise.resolve().then(() => {
            return tokenNotExpired('id_token');
        })
    }

    public authenticated(): boolean {
        return tokenNotExpired('id_token');
    }

    public login(username: string, password: string): Observable<any> {
        if (username === null || password === null) {
            return Observable.throw("Bad credentials");
        }
        let headers = new Headers();
        headers.append('username', username);
        headers.append('password', password);
        return this.http.post(authUrl, '', { headers: headers })
            .map(data => data.json())
            .do(data => {
                console.log('Data: ' + data);
                localStorage.setItem('id_token', data.token);
                this.idToken = data.token;
                let url = localStorage.getItem('redirect_url');
                this.router.navigate([url]);
                return this.authHttp.get(`${profileUrl}/myprofile`)
                    .map(data => data.json())
                    .do(data => {
                        localStorage.setItem("profile", JSON.stringify(data.profileVms.profileVms[0]));
                    })
                    .subscribe(()=>{
                        console.log("ssdffldskgjölaskdfjölsdf");
                    })
            }
        )
    }

    public register(credentials) {
        if (credentials.email === null || credentials.password === null) {
            return Observable.throw("Please insert credentials");
        } else {
            // At this point store the credentials to your backend!
            return Observable.create(observer => {
                observer.next(true);
                observer.complete();
            });
        }
    }

    isAdmin(): boolean {
        return true;
        // return this.getProfileRoles().indexOf('admin') != -1;
    }

    public logout() {
        localStorage.removeItem('profile');
        localStorage.removeItem('id_token');
        this.idToken = null;
        localStorage.removeItem('refresh_token');
        this.zoneImpl.run(() => this.user = null);
        // Unschedule the token refresh
        this.unscheduleRefresh();
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
        // this.storage.get('refresh_token').then(token => {
        //     console.log("refresh");
        // }).catch(error => {
        //     console.log(error);
        // });

    }
}
