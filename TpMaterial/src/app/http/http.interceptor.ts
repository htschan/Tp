import { Injectable } from "@angular/core";
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { Storage } from '@ionic/storage';

@Injectable()
export class InterceptedHttp extends Http {
    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private apiBaseUrl: string, private storage: Storage) {
        super(backend, defaultOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        if (typeof url === "string") {
            url = this.updateUrl(url);
            return Observable.fromPromise(this.getToken()).flatMap(token => {
                return super.request(url, this.getRequestOptionArgs(token, options));
            })
        }
        return super.request(url, options);
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return Observable.fromPromise(this.getToken()).flatMap(token => {
            return super.get(this.updateUrl(url), this.getRequestOptionArgs(token, options));
        })
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return Observable.fromPromise(this.getToken()).flatMap(token => {
            return super.post(this.updateUrl(url), body, this.getRequestOptionArgs(token, options));
        })
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return Observable.fromPromise(this.getToken()).flatMap(token => {
            return super.put(this.updateUrl(url), body, this.getRequestOptionArgs(token, options));
        })
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return Observable.fromPromise(this.getToken()).flatMap(token => {
            return super.delete(this.updateUrl(url), this.getRequestOptionArgs(token, options));
        })
    }

    private updateUrl(req: string) {
        if (req.startsWith('/api/v1'))
            return this.apiBaseUrl + req;
        return req;
    }

    private getRequestOptionArgs(token: string, options?: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        options.headers.append('Content-Type', 'application/json');
        options.headers.append('Accept', 'application/json');
        options.headers.append('Authorization', 'Bearer ' + token);
        return options;
    }

    private getToken(): Promise<string> {
        return this.storage.get('id_token');
    }
}