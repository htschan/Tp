import { Http, XHRBackend, RequestOptions } from '@angular/http';
import { InterceptedHttp } from './http.interceptor';
import { Storage } from '@ionic/storage';
import { OpaqueToken } from "@angular/core/src/core";

export function httpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions, baseurl: OpaqueToken, storage: Storage): Http {
    return new InterceptedHttp(xhrBackend, requestOptions, baseurl, storage);
}