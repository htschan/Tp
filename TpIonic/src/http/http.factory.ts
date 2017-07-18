import { Http, Request, RequestOptionsArgs, Response, XHRBackend, RequestOptions, ConnectionBackend, Headers } from '@angular/http';
import { InterceptedHttp } from './http.interceptor';

export function httpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions, baseurl: any): Http {
    return new InterceptedHttp(xhrBackend, requestOptions, baseurl);
}