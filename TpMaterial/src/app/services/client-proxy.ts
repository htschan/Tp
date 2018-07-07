﻿/* tslint:disable */
// ReSharper disable InconsistentNaming

import 'rxjs/add/operator/finally';
import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, from as _observableFrom, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';

import * as moment from 'moment';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

@Injectable()
export class TpClient {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "http://localhost:5000";
    }

    identity(): Observable<FileResponse | null> {
        let url_ = this.baseUrl + "/identity";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processIdentity(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processIdentity(<any>response_);
                } catch (e) {
                    return <Observable<FileResponse | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<FileResponse | null>><any>_observableThrow(response_);
        }));
    }

    protected processIdentity(response: HttpResponseBase): Observable<FileResponse | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200 || status === 206) {
            const contentDisposition = response.headers ? response.headers.get("content-disposition") : undefined;
            const fileNameMatch = contentDisposition ? /filename="?([^"]*?)"?(;|$)/g.exec(contentDisposition) : undefined;
            const fileName = fileNameMatch && fileNameMatch.length > 1 ? fileNameMatch[1] : undefined;
            return _observableOf({ fileName: fileName, data: <any>responseBlob, status: status, headers: _headers });
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<FileResponse | null>(<any>null);
    }
}

@Injectable()
export class TpSampleDataClient {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "http://localhost:5000";
    }

    weatherForecasts(): Observable<WeatherForecast[] | null> {
        let url_ = this.baseUrl + "/api/v1/SampleData/WeatherForecasts";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processWeatherForecasts(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processWeatherForecasts(<any>response_);
                } catch (e) {
                    return <Observable<WeatherForecast[] | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<WeatherForecast[] | null>><any>_observableThrow(response_);
        }));
    }

    protected processWeatherForecasts(response: HttpResponseBase): Observable<WeatherForecast[] | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            if (resultData200 && resultData200.constructor === Array) {
                result200 = [];
                for (let item of resultData200)
                    result200.push(WeatherForecast.fromJS(item));
            }
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<WeatherForecast[] | null>(<any>null);
    }
}

@Injectable()
export class TpAdminClient {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "http://localhost:5000";
    }

    getUsers(): Observable<UsersDto | null> {
        let url_ = this.baseUrl + "/api/v1/admin/getUsers";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetUsers(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetUsers(<any>response_);
                } catch (e) {
                    return <Observable<UsersDto | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<UsersDto | null>><any>_observableThrow(response_);
        }));
    }

    protected processGetUsers(response: HttpResponseBase): Observable<UsersDto | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? UsersDto.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<UsersDto | null>(<any>null);
    }

    getSessions(): Observable<SessionsDto | null> {
        let url_ = this.baseUrl + "/api/v1/admin/getSessions";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetSessions(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetSessions(<any>response_);
                } catch (e) {
                    return <Observable<SessionsDto | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<SessionsDto | null>><any>_observableThrow(response_);
        }));
    }

    protected processGetSessions(response: HttpResponseBase): Observable<SessionsDto | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? SessionsDto.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<SessionsDto | null>(<any>null);
    }
}

@Injectable()
export class TpOtherClient {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "http://localhost:5000";
    }

    sendMail(mailMessage: MailDto | null): Observable<void> {
        let url_ = this.baseUrl + "/api/v1/other/sendMail";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(mailMessage);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processSendMail(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processSendMail(<any>response_);
                } catch (e) {
                    return <Observable<void>><any>_observableThrow(e);
                }
            } else
                return <Observable<void>><any>_observableThrow(response_);
        }));
    }

    protected processSendMail(response: HttpResponseBase): Observable<void> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return _observableOf<void>(<any>null);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<void>(<any>null);
    }

    sendSlack(slackMessage: MailDto | null): Observable<void> {
        let url_ = this.baseUrl + "/api/v1/other/sendSlack";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(slackMessage);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processSendSlack(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processSendSlack(<any>response_);
                } catch (e) {
                    return <Observable<void>><any>_observableThrow(e);
                }
            } else
                return <Observable<void>><any>_observableThrow(response_);
        }));
    }

    protected processSendSlack(response: HttpResponseBase): Observable<void> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return _observableOf<void>(<any>null);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<void>(<any>null);
    }
}

@Injectable()
export class TpProfileClient {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "http://localhost:5000";
    }

    getProfiles(): Observable<ProfileResponseDto | null> {
        let url_ = this.baseUrl + "/api/v1/profile/getProfiles";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetProfiles(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetProfiles(<any>response_);
                } catch (e) {
                    return <Observable<ProfileResponseDto | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<ProfileResponseDto | null>><any>_observableThrow(response_);
        }));
    }

    protected processGetProfiles(response: HttpResponseBase): Observable<ProfileResponseDto | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? ProfileResponseDto.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<ProfileResponseDto | null>(<any>null);
    }

    profiles(userid: string | null): Observable<ProfileResponseDto | null> {
        let url_ = this.baseUrl + "/api/v1/profile/profiles/{userid}";
        if (userid === undefined || userid === null)
            throw new Error("The parameter 'userid' must be defined.");
        url_ = url_.replace("{userid}", encodeURIComponent("" + userid)); 
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processProfiles(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processProfiles(<any>response_);
                } catch (e) {
                    return <Observable<ProfileResponseDto | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<ProfileResponseDto | null>><any>_observableThrow(response_);
        }));
    }

    protected processProfiles(response: HttpResponseBase): Observable<ProfileResponseDto | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? ProfileResponseDto.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<ProfileResponseDto | null>(<any>null);
    }
}

@Injectable()
export class TpProfilesClient {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "http://localhost:5000";
    }

    myprofile(): Observable<ProfileResponseDto | null> {
        let url_ = this.baseUrl + "/api/v1/profile/profiles/myprofile";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processMyprofile(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processMyprofile(<any>response_);
                } catch (e) {
                    return <Observable<ProfileResponseDto | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<ProfileResponseDto | null>><any>_observableThrow(response_);
        }));
    }

    protected processMyprofile(response: HttpResponseBase): Observable<ProfileResponseDto | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? ProfileResponseDto.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<ProfileResponseDto | null>(<any>null);
    }
}

@Injectable()
export class TpPuClient {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "http://localhost:5000";
    }

    getUsers(): Observable<UsersDto | null> {
        let url_ = this.baseUrl + "/api/v1/pu/getUsers";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetUsers(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetUsers(<any>response_);
                } catch (e) {
                    return <Observable<UsersDto | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<UsersDto | null>><any>_observableThrow(response_);
        }));
    }

    protected processGetUsers(response: HttpResponseBase): Observable<UsersDto | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? UsersDto.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<UsersDto | null>(<any>null);
    }

    getMonthPunches(userId: string | null, month: number | null, year: number | null): Observable<MonthResponse | null> {
        let url_ = this.baseUrl + "/api/v1/pu/getMonthPunches?";
        if (userId === undefined)
            throw new Error("The parameter 'userId' must be defined.");
        else
            url_ += "userId=" + encodeURIComponent("" + userId) + "&"; 
        if (month === undefined)
            throw new Error("The parameter 'month' must be defined.");
        else
            url_ += "month=" + encodeURIComponent("" + month) + "&"; 
        if (year === undefined)
            throw new Error("The parameter 'year' must be defined.");
        else
            url_ += "year=" + encodeURIComponent("" + year) + "&"; 
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetMonthPunches(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetMonthPunches(<any>response_);
                } catch (e) {
                    return <Observable<MonthResponse | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<MonthResponse | null>><any>_observableThrow(response_);
        }));
    }

    protected processGetMonthPunches(response: HttpResponseBase): Observable<MonthResponse | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? MonthResponse.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<MonthResponse | null>(<any>null);
    }

    punchModify(modifyPunchAdminDto: ModifyPunchAdminDto | null): Observable<void> {
        let url_ = this.baseUrl + "/api/v1/pu/punchModify";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(modifyPunchAdminDto);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processPunchModify(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processPunchModify(<any>response_);
                } catch (e) {
                    return <Observable<void>><any>_observableThrow(e);
                }
            } else
                return <Observable<void>><any>_observableThrow(response_);
        }));
    }

    protected processPunchModify(response: HttpResponseBase): Observable<void> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return _observableOf<void>(<any>null);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<void>(<any>null);
    }

    setMonthStatus(setStatusAdminDto: StatusAdminDto | null): Observable<void> {
        let url_ = this.baseUrl + "/api/v1/pu/setMonthStatus";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(setStatusAdminDto);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processSetMonthStatus(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processSetMonthStatus(<any>response_);
                } catch (e) {
                    return <Observable<void>><any>_observableThrow(e);
                }
            } else
                return <Observable<void>><any>_observableThrow(response_);
        }));
    }

    protected processSetMonthStatus(response: HttpResponseBase): Observable<void> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return _observableOf<void>(<any>null);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<void>(<any>null);
    }
}

@Injectable()
export class TpPunchClient {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "http://localhost:5000";
    }

    getPunches(): Observable<PunchDto[] | null> {
        let url_ = this.baseUrl + "/api/v1/punch/getPunches";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetPunches(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetPunches(<any>response_);
                } catch (e) {
                    return <Observable<PunchDto[] | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<PunchDto[] | null>><any>_observableThrow(response_);
        }));
    }

    protected processGetPunches(response: HttpResponseBase): Observable<PunchDto[] | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            if (resultData200 && resultData200.constructor === Array) {
                result200 = [];
                for (let item of resultData200)
                    result200.push(PunchDto.fromJS(item));
            }
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<PunchDto[] | null>(<any>null);
    }

    getDayPunches(day: number | null, month: number | null, year: number | null): Observable<DayResponse | null> {
        let url_ = this.baseUrl + "/api/v1/punch/getDayPunches?";
        if (day === undefined)
            throw new Error("The parameter 'day' must be defined.");
        else
            url_ += "day=" + encodeURIComponent("" + day) + "&"; 
        if (month === undefined)
            throw new Error("The parameter 'month' must be defined.");
        else
            url_ += "month=" + encodeURIComponent("" + month) + "&"; 
        if (year === undefined)
            throw new Error("The parameter 'year' must be defined.");
        else
            url_ += "year=" + encodeURIComponent("" + year) + "&"; 
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetDayPunches(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetDayPunches(<any>response_);
                } catch (e) {
                    return <Observable<DayResponse | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<DayResponse | null>><any>_observableThrow(response_);
        }));
    }

    protected processGetDayPunches(response: HttpResponseBase): Observable<DayResponse | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? DayResponse.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<DayResponse | null>(<any>null);
    }

    getWeekPunches(week: number | null, year: number | null): Observable<WeekResponse | null> {
        let url_ = this.baseUrl + "/api/v1/punch/getWeekPunches?";
        if (week === undefined)
            throw new Error("The parameter 'week' must be defined.");
        else
            url_ += "week=" + encodeURIComponent("" + week) + "&"; 
        if (year === undefined)
            throw new Error("The parameter 'year' must be defined.");
        else
            url_ += "year=" + encodeURIComponent("" + year) + "&"; 
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetWeekPunches(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetWeekPunches(<any>response_);
                } catch (e) {
                    return <Observable<WeekResponse | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<WeekResponse | null>><any>_observableThrow(response_);
        }));
    }

    protected processGetWeekPunches(response: HttpResponseBase): Observable<WeekResponse | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? WeekResponse.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<WeekResponse | null>(<any>null);
    }

    getMonthPunches(month: number | null, year: number | null): Observable<MonthResponse | null> {
        let url_ = this.baseUrl + "/api/v1/punch/getMonthPunches?";
        if (month === undefined)
            throw new Error("The parameter 'month' must be defined.");
        else
            url_ += "month=" + encodeURIComponent("" + month) + "&"; 
        if (year === undefined)
            throw new Error("The parameter 'year' must be defined.");
        else
            url_ += "year=" + encodeURIComponent("" + year) + "&"; 
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetMonthPunches(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetMonthPunches(<any>response_);
                } catch (e) {
                    return <Observable<MonthResponse | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<MonthResponse | null>><any>_observableThrow(response_);
        }));
    }

    protected processGetMonthPunches(response: HttpResponseBase): Observable<MonthResponse | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? MonthResponse.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<MonthResponse | null>(<any>null);
    }

    getYearPunches(year: number | null): Observable<YearResponse | null> {
        let url_ = this.baseUrl + "/api/v1/punch/getYearPunches?";
        if (year === undefined)
            throw new Error("The parameter 'year' must be defined.");
        else
            url_ += "year=" + encodeURIComponent("" + year) + "&"; 
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetYearPunches(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetYearPunches(<any>response_);
                } catch (e) {
                    return <Observable<YearResponse | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<YearResponse | null>><any>_observableThrow(response_);
        }));
    }

    protected processGetYearPunches(response: HttpResponseBase): Observable<YearResponse | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? YearResponse.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<YearResponse | null>(<any>null);
    }

    punchIn(): Observable<DayResponse | null> {
        let url_ = this.baseUrl + "/api/v1/punch/punchIn";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processPunchIn(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processPunchIn(<any>response_);
                } catch (e) {
                    return <Observable<DayResponse | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<DayResponse | null>><any>_observableThrow(response_);
        }));
    }

    protected processPunchIn(response: HttpResponseBase): Observable<DayResponse | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? DayResponse.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<DayResponse | null>(<any>null);
    }

    punchOut(): Observable<DayResponse | null> {
        let url_ = this.baseUrl + "/api/v1/punch/punchOut";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processPunchOut(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processPunchOut(<any>response_);
                } catch (e) {
                    return <Observable<DayResponse | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<DayResponse | null>><any>_observableThrow(response_);
        }));
    }

    protected processPunchOut(response: HttpResponseBase): Observable<DayResponse | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? DayResponse.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<DayResponse | null>(<any>null);
    }

    punchModify(modifyPunchDto: ModifyPunchDto | null): Observable<void> {
        let url_ = this.baseUrl + "/api/v1/punch/punchModify";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(modifyPunchDto);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processPunchModify(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processPunchModify(<any>response_);
                } catch (e) {
                    return <Observable<void>><any>_observableThrow(e);
                }
            } else
                return <Observable<void>><any>_observableThrow(response_);
        }));
    }

    protected processPunchModify(response: HttpResponseBase): Observable<void> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return _observableOf<void>(<any>null);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<void>(<any>null);
    }

    punchDelete(deletePunchDto: DeletePunchDto | null): Observable<void> {
        let url_ = this.baseUrl + "/api/v1/punch/punchDelete";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(deletePunchDto);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
            })
        };

        return this.http.request("delete", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processPunchDelete(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processPunchDelete(<any>response_);
                } catch (e) {
                    return <Observable<void>><any>_observableThrow(e);
                }
            } else
                return <Observable<void>><any>_observableThrow(response_);
        }));
    }

    protected processPunchDelete(response: HttpResponseBase): Observable<void> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return _observableOf<void>(<any>null);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<void>(<any>null);
    }
}

@Injectable()
export class TpUserClient {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "http://localhost:5000";
    }

    /**
     * Sendet eine Authentifizierungsanfrage an den Server
    * @credentials Credentials mit E-Mail und Passwort.
    * @return Returns AuthResponse
     */
    authenticate(credentials: CredentialDto | null): Observable<AuthResponse | null> {
        let url_ = this.baseUrl + "/api/v1/user/authenticate";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(credentials);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processAuthenticate(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processAuthenticate(<any>response_);
                } catch (e) {
                    return <Observable<AuthResponse | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<AuthResponse | null>><any>_observableThrow(response_);
        }));
    }

    protected processAuthenticate(response: HttpResponseBase): Observable<AuthResponse | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? AuthResponse.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<AuthResponse | null>(<any>null);
    }

    /**
     * Sendet eine RefreshToken Abfrage an den Server [AllowAnonymous]
    * @refreshtokenparameter Eine ASCII-Zeichenfolge mit mindestens einem Zeichen.
    * @return AuthResponse
     */
    refreshtoken(refreshtokenparameter: RefreshTokenDto | null): Observable<AuthResponse | null> {
        let url_ = this.baseUrl + "/api/v1/user/refreshtoken";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(refreshtokenparameter);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processRefreshtoken(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processRefreshtoken(<any>response_);
                } catch (e) {
                    return <Observable<AuthResponse | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<AuthResponse | null>><any>_observableThrow(response_);
        }));
    }

    protected processRefreshtoken(response: HttpResponseBase): Observable<AuthResponse | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? AuthResponse.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<AuthResponse | null>(<any>null);
    }

    register(registerDto: RegisterDto | null): Observable<RegisterResponse | null> {
        let url_ = this.baseUrl + "/api/v1/user/register";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(registerDto);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processRegister(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processRegister(<any>response_);
                } catch (e) {
                    return <Observable<RegisterResponse | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<RegisterResponse | null>><any>_observableThrow(response_);
        }));
    }

    protected processRegister(response: HttpResponseBase): Observable<RegisterResponse | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? RegisterResponse.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<RegisterResponse | null>(<any>null);
    }

    confirm(id: string | null, cnf: string | null): Observable<ConfirmResponse | null> {
        let url_ = this.baseUrl + "/api/v1/user/confirm?";
        if (id === undefined)
            throw new Error("The parameter 'id' must be defined.");
        else
            url_ += "id=" + encodeURIComponent("" + id) + "&"; 
        if (cnf === undefined)
            throw new Error("The parameter 'cnf' must be defined.");
        else
            url_ += "cnf=" + encodeURIComponent("" + cnf) + "&"; 
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processConfirm(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processConfirm(<any>response_);
                } catch (e) {
                    return <Observable<ConfirmResponse | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<ConfirmResponse | null>><any>_observableThrow(response_);
        }));
    }

    protected processConfirm(response: HttpResponseBase): Observable<ConfirmResponse | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? ConfirmResponse.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<ConfirmResponse | null>(<any>null);
    }

    recoverPassword(recoverPasswordParams: RecoverPasswordParams | null): Observable<RecoverPasswordResponse | null> {
        let url_ = this.baseUrl + "/api/v1/user/recoverPassword";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(recoverPasswordParams);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processRecoverPassword(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processRecoverPassword(<any>response_);
                } catch (e) {
                    return <Observable<RecoverPasswordResponse | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<RecoverPasswordResponse | null>><any>_observableThrow(response_);
        }));
    }

    protected processRecoverPassword(response: HttpResponseBase): Observable<RecoverPasswordResponse | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? RecoverPasswordResponse.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<RecoverPasswordResponse | null>(<any>null);
    }

    recoverUsername(recoverUsernameParams: RecoverUsernameParams | null): Observable<RecoverUsernameResponse | null> {
        let url_ = this.baseUrl + "/api/v1/user/recoverUsername";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(recoverUsernameParams);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processRecoverUsername(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processRecoverUsername(<any>response_);
                } catch (e) {
                    return <Observable<RecoverUsernameResponse | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<RecoverUsernameResponse | null>><any>_observableThrow(response_);
        }));
    }

    protected processRecoverUsername(response: HttpResponseBase): Observable<RecoverUsernameResponse | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? RecoverUsernameResponse.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<RecoverUsernameResponse | null>(<any>null);
    }

    setPassword(setPasswordParams: SetPasswordParams | null): Observable<SetPasswordResponse | null> {
        let url_ = this.baseUrl + "/api/v1/user/setPassword";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(setPasswordParams);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processSetPassword(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processSetPassword(<any>response_);
                } catch (e) {
                    return <Observable<SetPasswordResponse | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<SetPasswordResponse | null>><any>_observableThrow(response_);
        }));
    }

    protected processSetPassword(response: HttpResponseBase): Observable<SetPasswordResponse | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? SetPasswordResponse.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<SetPasswordResponse | null>(<any>null);
    }
}

export class WeatherForecast implements IWeatherForecast {
    dateFormatted?: string | undefined;
    temperatureC!: number;
    summary?: string | undefined;
    temperatureF!: number;

    constructor(data?: IWeatherForecast) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.dateFormatted = data["dateFormatted"];
            this.temperatureC = data["temperatureC"];
            this.summary = data["summary"];
            this.temperatureF = data["temperatureF"];
        }
    }

    static fromJS(data: any): WeatherForecast {
        data = typeof data === 'object' ? data : {};
        let result = new WeatherForecast();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["dateFormatted"] = this.dateFormatted;
        data["temperatureC"] = this.temperatureC;
        data["summary"] = this.summary;
        data["temperatureF"] = this.temperatureF;
        return data; 
    }

    clone(): WeatherForecast {
        const json = this.toJSON();
        let result = new WeatherForecast();
        result.init(json);
        return result;
    }
}

export interface IWeatherForecast {
    dateFormatted?: string | undefined;
    temperatureC: number;
    summary?: string | undefined;
    temperatureF: number;
}

export class UsersDto implements IUsersDto {
    users?: UserDto[] | undefined;

    constructor(data?: IUsersDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            if (data["users"] && data["users"].constructor === Array) {
                this.users = [];
                for (let item of data["users"])
                    this.users.push(UserDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): UsersDto {
        data = typeof data === 'object' ? data : {};
        let result = new UsersDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        if (this.users && this.users.constructor === Array) {
            data["users"] = [];
            for (let item of this.users)
                data["users"].push(item.toJSON());
        }
        return data; 
    }

    clone(): UsersDto {
        const json = this.toJSON();
        let result = new UsersDto();
        result.init(json);
        return result;
    }
}

export interface IUsersDto {
    users?: UserDto[] | undefined;
}

export class UserDto implements IUserDto {
    id?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    email?: string | undefined;
    emailConfirmed?: boolean | undefined;
    accessFailedCount?: number | undefined;
    roleNames?: RoleDto[] | undefined;

    constructor(data?: IUserDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.id = data["id"];
            this.firstName = data["firstName"];
            this.lastName = data["lastName"];
            this.email = data["email"];
            this.emailConfirmed = data["emailConfirmed"];
            this.accessFailedCount = data["accessFailedCount"];
            if (data["roleNames"] && data["roleNames"].constructor === Array) {
                this.roleNames = [];
                for (let item of data["roleNames"])
                    this.roleNames.push(RoleDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): UserDto {
        data = typeof data === 'object' ? data : {};
        let result = new UserDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["firstName"] = this.firstName;
        data["lastName"] = this.lastName;
        data["email"] = this.email;
        data["emailConfirmed"] = this.emailConfirmed;
        data["accessFailedCount"] = this.accessFailedCount;
        if (this.roleNames && this.roleNames.constructor === Array) {
            data["roleNames"] = [];
            for (let item of this.roleNames)
                data["roleNames"].push(item.toJSON());
        }
        return data; 
    }

    clone(): UserDto {
        const json = this.toJSON();
        let result = new UserDto();
        result.init(json);
        return result;
    }
}

export interface IUserDto {
    id?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    email?: string | undefined;
    emailConfirmed?: boolean | undefined;
    accessFailedCount?: number | undefined;
    roleNames?: RoleDto[] | undefined;
}

export class RoleDto implements IRoleDto {
    name?: string | undefined;

    constructor(data?: IRoleDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.name = data["name"];
        }
    }

    static fromJS(data: any): RoleDto {
        data = typeof data === 'object' ? data : {};
        let result = new RoleDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["name"] = this.name;
        return data; 
    }

    clone(): RoleDto {
        const json = this.toJSON();
        let result = new RoleDto();
        result.init(json);
        return result;
    }
}

export interface IRoleDto {
    name?: string | undefined;
}

export class SessionsDto implements ISessionsDto {
    sessions?: SessionDto[] | undefined;

    constructor(data?: ISessionsDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            if (data["sessions"] && data["sessions"].constructor === Array) {
                this.sessions = [];
                for (let item of data["sessions"])
                    this.sessions.push(SessionDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): SessionsDto {
        data = typeof data === 'object' ? data : {};
        let result = new SessionsDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        if (this.sessions && this.sessions.constructor === Array) {
            data["sessions"] = [];
            for (let item of this.sessions)
                data["sessions"].push(item.toJSON());
        }
        return data; 
    }

    clone(): SessionsDto {
        const json = this.toJSON();
        let result = new SessionsDto();
        result.init(json);
        return result;
    }
}

export interface ISessionsDto {
    sessions?: SessionDto[] | undefined;
}

export class SessionDto implements ISessionDto {
    id?: string | undefined;
    userid?: string | undefined;
    email?: string | undefined;
    created?: string | undefined;
    isStop?: boolean | undefined;

    constructor(data?: ISessionDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.id = data["id"];
            this.userid = data["userid"];
            this.email = data["email"];
            this.created = data["created"];
            this.isStop = data["isStop"];
        }
    }

    static fromJS(data: any): SessionDto {
        data = typeof data === 'object' ? data : {};
        let result = new SessionDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["userid"] = this.userid;
        data["email"] = this.email;
        data["created"] = this.created;
        data["isStop"] = this.isStop;
        return data; 
    }

    clone(): SessionDto {
        const json = this.toJSON();
        let result = new SessionDto();
        result.init(json);
        return result;
    }
}

export interface ISessionDto {
    id?: string | undefined;
    userid?: string | undefined;
    email?: string | undefined;
    created?: string | undefined;
    isStop?: boolean | undefined;
}

export class MailDto implements IMailDto {
    subject?: string | undefined;
    body?: string | undefined;

    constructor(data?: IMailDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.subject = data["subject"];
            this.body = data["body"];
        }
    }

    static fromJS(data: any): MailDto {
        data = typeof data === 'object' ? data : {};
        let result = new MailDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["subject"] = this.subject;
        data["body"] = this.body;
        return data; 
    }

    clone(): MailDto {
        const json = this.toJSON();
        let result = new MailDto();
        result.init(json);
        return result;
    }
}

export interface IMailDto {
    subject?: string | undefined;
    body?: string | undefined;
}

export class ProfileResponseDto implements IProfileResponseDto {
    id?: string | undefined;
    pictureUrl?: string | undefined;
    user?: UserDto | undefined;
    status?: OpResult | undefined;

    constructor(data?: IProfileResponseDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.id = data["id"];
            this.pictureUrl = data["pictureUrl"];
            this.user = data["user"] ? UserDto.fromJS(data["user"]) : <any>undefined;
            this.status = data["status"] ? OpResult.fromJS(data["status"]) : <any>undefined;
        }
    }

    static fromJS(data: any): ProfileResponseDto {
        data = typeof data === 'object' ? data : {};
        let result = new ProfileResponseDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["pictureUrl"] = this.pictureUrl;
        data["user"] = this.user ? this.user.toJSON() : <any>undefined;
        data["status"] = this.status ? this.status.toJSON() : <any>undefined;
        return data; 
    }

    clone(): ProfileResponseDto {
        const json = this.toJSON();
        let result = new ProfileResponseDto();
        result.init(json);
        return result;
    }
}

export interface IProfileResponseDto {
    id?: string | undefined;
    pictureUrl?: string | undefined;
    user?: UserDto | undefined;
    status?: OpResult | undefined;
}

export class OpResult implements IOpResult {
    success?: boolean | undefined;
    result?: string | undefined;

    constructor(data?: IOpResult) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.success = data["success"];
            this.result = data["result"];
        }
    }

    static fromJS(data: any): OpResult {
        data = typeof data === 'object' ? data : {};
        let result = new OpResult();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["success"] = this.success;
        data["result"] = this.result;
        return data; 
    }

    clone(): OpResult {
        const json = this.toJSON();
        let result = new OpResult();
        result.init(json);
        return result;
    }
}

export interface IOpResult {
    success?: boolean | undefined;
    result?: string | undefined;
}

export class MonthResponse implements IMonthResponse {
    status?: OpResult | undefined;
    punches?: MonthPunchesDto | undefined;

    constructor(data?: IMonthResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.status = data["status"] ? OpResult.fromJS(data["status"]) : <any>undefined;
            this.punches = data["punches"] ? MonthPunchesDto.fromJS(data["punches"]) : <any>undefined;
        }
    }

    static fromJS(data: any): MonthResponse {
        data = typeof data === 'object' ? data : {};
        let result = new MonthResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["status"] = this.status ? this.status.toJSON() : <any>undefined;
        data["punches"] = this.punches ? this.punches.toJSON() : <any>undefined;
        return data; 
    }

    clone(): MonthResponse {
        const json = this.toJSON();
        let result = new MonthResponse();
        result.init(json);
        return result;
    }
}

export interface IMonthResponse {
    status?: OpResult | undefined;
    punches?: MonthPunchesDto | undefined;
}

export class MonthPunchesDto implements IMonthPunchesDto {
    user?: string | undefined;
    state?: StatusAdminDto | undefined;
    month?: number | undefined;
    year?: number | undefined;
    punches?: DayPunchesDto[] | undefined;

    constructor(data?: IMonthPunchesDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.user = data["user"];
            this.state = data["state"] ? StatusAdminDto.fromJS(data["state"]) : <any>undefined;
            this.month = data["month"];
            this.year = data["year"];
            if (data["punches"] && data["punches"].constructor === Array) {
                this.punches = [];
                for (let item of data["punches"])
                    this.punches.push(DayPunchesDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): MonthPunchesDto {
        data = typeof data === 'object' ? data : {};
        let result = new MonthPunchesDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["user"] = this.user;
        data["state"] = this.state ? this.state.toJSON() : <any>undefined;
        data["month"] = this.month;
        data["year"] = this.year;
        if (this.punches && this.punches.constructor === Array) {
            data["punches"] = [];
            for (let item of this.punches)
                data["punches"].push(item.toJSON());
        }
        return data; 
    }

    clone(): MonthPunchesDto {
        const json = this.toJSON();
        let result = new MonthPunchesDto();
        result.init(json);
        return result;
    }
}

export interface IMonthPunchesDto {
    user?: string | undefined;
    state?: StatusAdminDto | undefined;
    month?: number | undefined;
    year?: number | undefined;
    punches?: DayPunchesDto[] | undefined;
}

export class StatusAdminDto implements IStatusAdminDto {
    userid?: string | undefined;
    status?: StatusAdminDtoStatus | undefined;
    month?: number | undefined;
    year?: number | undefined;

    constructor(data?: IStatusAdminDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.userid = data["userid"];
            this.status = data["status"];
            this.month = data["month"];
            this.year = data["year"];
        }
    }

    static fromJS(data: any): StatusAdminDto {
        data = typeof data === 'object' ? data : {};
        let result = new StatusAdminDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["userid"] = this.userid;
        data["status"] = this.status;
        data["month"] = this.month;
        data["year"] = this.year;
        return data; 
    }

    clone(): StatusAdminDto {
        const json = this.toJSON();
        let result = new StatusAdminDto();
        result.init(json);
        return result;
    }
}

export interface IStatusAdminDto {
    userid?: string | undefined;
    status?: StatusAdminDtoStatus | undefined;
    month?: number | undefined;
    year?: number | undefined;
}

export enum StatusAdminDtoStatus {
    Open = "open", 
    OpenAdmin = "openAdmin", 
    Closed = "closed", 
}

export class DayPunchesDto implements IDayPunchesDto {
    userboid?: string | undefined;
    day?: number | undefined;
    month?: number | undefined;
    year?: number | undefined;
    punches?: PunchRowDto[] | undefined;
    daytotal?: number | undefined;

    constructor(data?: IDayPunchesDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.userboid = data["userboid"];
            this.day = data["day"];
            this.month = data["month"];
            this.year = data["year"];
            if (data["punches"] && data["punches"].constructor === Array) {
                this.punches = [];
                for (let item of data["punches"])
                    this.punches.push(PunchRowDto.fromJS(item));
            }
            this.daytotal = data["daytotal"];
        }
    }

    static fromJS(data: any): DayPunchesDto {
        data = typeof data === 'object' ? data : {};
        let result = new DayPunchesDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["userboid"] = this.userboid;
        data["day"] = this.day;
        data["month"] = this.month;
        data["year"] = this.year;
        if (this.punches && this.punches.constructor === Array) {
            data["punches"] = [];
            for (let item of this.punches)
                data["punches"].push(item.toJSON());
        }
        data["daytotal"] = this.daytotal;
        return data; 
    }

    clone(): DayPunchesDto {
        const json = this.toJSON();
        let result = new DayPunchesDto();
        result.init(json);
        return result;
    }
}

export interface IDayPunchesDto {
    userboid?: string | undefined;
    day?: number | undefined;
    month?: number | undefined;
    year?: number | undefined;
    punches?: PunchRowDto[] | undefined;
    daytotal?: number | undefined;
}

export class PunchRowDto implements IPunchRowDto {
    enter?: PunchDto | undefined;
    leave?: PunchDto | undefined;
    rowTotal?: number | undefined;

    constructor(data?: IPunchRowDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.enter = data["enter"] ? PunchDto.fromJS(data["enter"]) : <any>undefined;
            this.leave = data["leave"] ? PunchDto.fromJS(data["leave"]) : <any>undefined;
            this.rowTotal = data["rowTotal"];
        }
    }

    static fromJS(data: any): PunchRowDto {
        data = typeof data === 'object' ? data : {};
        let result = new PunchRowDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["enter"] = this.enter ? this.enter.toJSON() : <any>undefined;
        data["leave"] = this.leave ? this.leave.toJSON() : <any>undefined;
        data["rowTotal"] = this.rowTotal;
        return data; 
    }

    clone(): PunchRowDto {
        const json = this.toJSON();
        let result = new PunchRowDto();
        result.init(json);
        return result;
    }
}

export interface IPunchRowDto {
    enter?: PunchDto | undefined;
    leave?: PunchDto | undefined;
    rowTotal?: number | undefined;
}

export class PunchDto implements IPunchDto {
    time?: moment.Moment | undefined;
    timedec?: number | undefined;
    direction?: boolean | undefined;
    created?: moment.Moment | undefined;
    updated?: moment.Moment | undefined;
    punchid?: string | undefined;

    constructor(data?: IPunchDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.time = data["time"] ? moment(data["time"].toString()) : <any>undefined;
            this.timedec = data["timedec"];
            this.direction = data["direction"];
            this.created = data["created"] ? moment(data["created"].toString()) : <any>undefined;
            this.updated = data["updated"] ? moment(data["updated"].toString()) : <any>undefined;
            this.punchid = data["punchid"];
        }
    }

    static fromJS(data: any): PunchDto {
        data = typeof data === 'object' ? data : {};
        let result = new PunchDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["time"] = this.time ? this.time.toISOString() : <any>undefined;
        data["timedec"] = this.timedec;
        data["direction"] = this.direction;
        data["created"] = this.created ? this.created.toISOString() : <any>undefined;
        data["updated"] = this.updated ? this.updated.toISOString() : <any>undefined;
        data["punchid"] = this.punchid;
        return data; 
    }

    clone(): PunchDto {
        const json = this.toJSON();
        let result = new PunchDto();
        result.init(json);
        return result;
    }
}

export interface IPunchDto {
    time?: moment.Moment | undefined;
    timedec?: number | undefined;
    direction?: boolean | undefined;
    created?: moment.Moment | undefined;
    updated?: moment.Moment | undefined;
    punchid?: string | undefined;
}

export class ModifyPunchAdminDto implements IModifyPunchAdminDto {
    punchid?: string | undefined;
    userid?: string | undefined;
    timedec?: number | undefined;
    direction?: boolean | undefined;

    constructor(data?: IModifyPunchAdminDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.punchid = data["punchid"];
            this.userid = data["userid"];
            this.timedec = data["timedec"];
            this.direction = data["direction"];
        }
    }

    static fromJS(data: any): ModifyPunchAdminDto {
        data = typeof data === 'object' ? data : {};
        let result = new ModifyPunchAdminDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["punchid"] = this.punchid;
        data["userid"] = this.userid;
        data["timedec"] = this.timedec;
        data["direction"] = this.direction;
        return data; 
    }

    clone(): ModifyPunchAdminDto {
        const json = this.toJSON();
        let result = new ModifyPunchAdminDto();
        result.init(json);
        return result;
    }
}

export interface IModifyPunchAdminDto {
    punchid?: string | undefined;
    userid?: string | undefined;
    timedec?: number | undefined;
    direction?: boolean | undefined;
}

export class DayResponse implements IDayResponse {
    status?: OpResult | undefined;
    punches?: DayPunchesDto | undefined;

    constructor(data?: IDayResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.status = data["status"] ? OpResult.fromJS(data["status"]) : <any>undefined;
            this.punches = data["punches"] ? DayPunchesDto.fromJS(data["punches"]) : <any>undefined;
        }
    }

    static fromJS(data: any): DayResponse {
        data = typeof data === 'object' ? data : {};
        let result = new DayResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["status"] = this.status ? this.status.toJSON() : <any>undefined;
        data["punches"] = this.punches ? this.punches.toJSON() : <any>undefined;
        return data; 
    }

    clone(): DayResponse {
        const json = this.toJSON();
        let result = new DayResponse();
        result.init(json);
        return result;
    }
}

export interface IDayResponse {
    status?: OpResult | undefined;
    punches?: DayPunchesDto | undefined;
}

export class WeekResponse implements IWeekResponse {
    status?: OpResult | undefined;
    punches?: WeekPunchesDto | undefined;

    constructor(data?: IWeekResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.status = data["status"] ? OpResult.fromJS(data["status"]) : <any>undefined;
            this.punches = data["punches"] ? WeekPunchesDto.fromJS(data["punches"]) : <any>undefined;
        }
    }

    static fromJS(data: any): WeekResponse {
        data = typeof data === 'object' ? data : {};
        let result = new WeekResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["status"] = this.status ? this.status.toJSON() : <any>undefined;
        data["punches"] = this.punches ? this.punches.toJSON() : <any>undefined;
        return data; 
    }

    clone(): WeekResponse {
        const json = this.toJSON();
        let result = new WeekResponse();
        result.init(json);
        return result;
    }
}

export interface IWeekResponse {
    status?: OpResult | undefined;
    punches?: WeekPunchesDto | undefined;
}

export class WeekPunchesDto implements IWeekPunchesDto {
    user?: string | undefined;
    week?: number | undefined;
    year?: number | undefined;
    dayPunches?: DayPunchesDto[] | undefined;

    constructor(data?: IWeekPunchesDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.user = data["user"];
            this.week = data["week"];
            this.year = data["year"];
            if (data["dayPunches"] && data["dayPunches"].constructor === Array) {
                this.dayPunches = [];
                for (let item of data["dayPunches"])
                    this.dayPunches.push(DayPunchesDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): WeekPunchesDto {
        data = typeof data === 'object' ? data : {};
        let result = new WeekPunchesDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["user"] = this.user;
        data["week"] = this.week;
        data["year"] = this.year;
        if (this.dayPunches && this.dayPunches.constructor === Array) {
            data["dayPunches"] = [];
            for (let item of this.dayPunches)
                data["dayPunches"].push(item.toJSON());
        }
        return data; 
    }

    clone(): WeekPunchesDto {
        const json = this.toJSON();
        let result = new WeekPunchesDto();
        result.init(json);
        return result;
    }
}

export interface IWeekPunchesDto {
    user?: string | undefined;
    week?: number | undefined;
    year?: number | undefined;
    dayPunches?: DayPunchesDto[] | undefined;
}

export class YearResponse implements IYearResponse {
    status?: OpResult | undefined;
    punches?: YearPunchesDto | undefined;

    constructor(data?: IYearResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.status = data["status"] ? OpResult.fromJS(data["status"]) : <any>undefined;
            this.punches = data["punches"] ? YearPunchesDto.fromJS(data["punches"]) : <any>undefined;
        }
    }

    static fromJS(data: any): YearResponse {
        data = typeof data === 'object' ? data : {};
        let result = new YearResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["status"] = this.status ? this.status.toJSON() : <any>undefined;
        data["punches"] = this.punches ? this.punches.toJSON() : <any>undefined;
        return data; 
    }

    clone(): YearResponse {
        const json = this.toJSON();
        let result = new YearResponse();
        result.init(json);
        return result;
    }
}

export interface IYearResponse {
    status?: OpResult | undefined;
    punches?: YearPunchesDto | undefined;
}

export class YearPunchesDto implements IYearPunchesDto {
    user?: string | undefined;
    year?: number | undefined;
    punches?: MonthPunchesDto[] | undefined;

    constructor(data?: IYearPunchesDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.user = data["user"];
            this.year = data["year"];
            if (data["punches"] && data["punches"].constructor === Array) {
                this.punches = [];
                for (let item of data["punches"])
                    this.punches.push(MonthPunchesDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): YearPunchesDto {
        data = typeof data === 'object' ? data : {};
        let result = new YearPunchesDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["user"] = this.user;
        data["year"] = this.year;
        if (this.punches && this.punches.constructor === Array) {
            data["punches"] = [];
            for (let item of this.punches)
                data["punches"].push(item.toJSON());
        }
        return data; 
    }

    clone(): YearPunchesDto {
        const json = this.toJSON();
        let result = new YearPunchesDto();
        result.init(json);
        return result;
    }
}

export interface IYearPunchesDto {
    user?: string | undefined;
    year?: number | undefined;
    punches?: MonthPunchesDto[] | undefined;
}

export class ModifyPunchDto implements IModifyPunchDto {
    punchid?: string | undefined;
    timedec?: number | undefined;
    direction?: boolean | undefined;

    constructor(data?: IModifyPunchDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.punchid = data["punchid"];
            this.timedec = data["timedec"];
            this.direction = data["direction"];
        }
    }

    static fromJS(data: any): ModifyPunchDto {
        data = typeof data === 'object' ? data : {};
        let result = new ModifyPunchDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["punchid"] = this.punchid;
        data["timedec"] = this.timedec;
        data["direction"] = this.direction;
        return data; 
    }

    clone(): ModifyPunchDto {
        const json = this.toJSON();
        let result = new ModifyPunchDto();
        result.init(json);
        return result;
    }
}

export interface IModifyPunchDto {
    punchid?: string | undefined;
    timedec?: number | undefined;
    direction?: boolean | undefined;
}

export class DeletePunchDto implements IDeletePunchDto {
    punchid?: string | undefined;

    constructor(data?: IDeletePunchDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.punchid = data["punchid"];
        }
    }

    static fromJS(data: any): DeletePunchDto {
        data = typeof data === 'object' ? data : {};
        let result = new DeletePunchDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["punchid"] = this.punchid;
        return data; 
    }

    clone(): DeletePunchDto {
        const json = this.toJSON();
        let result = new DeletePunchDto();
        result.init(json);
        return result;
    }
}

export interface IDeletePunchDto {
    punchid?: string | undefined;
}

export class CredentialDto implements ICredentialDto {
    client_type?: string | undefined;
    username?: string | undefined;
    password?: string | undefined;

    constructor(data?: ICredentialDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.client_type = data["client_type"];
            this.username = data["username"];
            this.password = data["password"];
        }
    }

    static fromJS(data: any): CredentialDto {
        data = typeof data === 'object' ? data : {};
        let result = new CredentialDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["client_type"] = this.client_type;
        data["username"] = this.username;
        data["password"] = this.password;
        return data; 
    }

    clone(): CredentialDto {
        const json = this.toJSON();
        let result = new CredentialDto();
        result.init(json);
        return result;
    }
}

export interface ICredentialDto {
    client_type?: string | undefined;
    username?: string | undefined;
    password?: string | undefined;
}

export class AuthResponse implements IAuthResponse {
    status?: OpResult | undefined;
    validFor?: number | undefined;
    id?: string | undefined;
    token?: string | undefined;
    refreshtoken?: string | undefined;

    constructor(data?: IAuthResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.status = data["status"] ? OpResult.fromJS(data["status"]) : <any>undefined;
            this.validFor = data["validFor"];
            this.id = data["id"];
            this.token = data["token"];
            this.refreshtoken = data["refreshtoken"];
        }
    }

    static fromJS(data: any): AuthResponse {
        data = typeof data === 'object' ? data : {};
        let result = new AuthResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["status"] = this.status ? this.status.toJSON() : <any>undefined;
        data["validFor"] = this.validFor;
        data["id"] = this.id;
        data["token"] = this.token;
        data["refreshtoken"] = this.refreshtoken;
        return data; 
    }

    clone(): AuthResponse {
        const json = this.toJSON();
        let result = new AuthResponse();
        result.init(json);
        return result;
    }
}

export interface IAuthResponse {
    status?: OpResult | undefined;
    validFor?: number | undefined;
    id?: string | undefined;
    token?: string | undefined;
    refreshtoken?: string | undefined;
}

export class RefreshTokenDto implements IRefreshTokenDto {
    refresh_token?: string | undefined;

    constructor(data?: IRefreshTokenDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.refresh_token = data["refresh_token"];
        }
    }

    static fromJS(data: any): RefreshTokenDto {
        data = typeof data === 'object' ? data : {};
        let result = new RefreshTokenDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["refresh_token"] = this.refresh_token;
        return data; 
    }

    clone(): RefreshTokenDto {
        const json = this.toJSON();
        let result = new RefreshTokenDto();
        result.init(json);
        return result;
    }
}

export interface IRefreshTokenDto {
    refresh_token?: string | undefined;
}

export class RegisterDto implements IRegisterDto {
    firstname?: string | undefined;
    name?: string | undefined;
    email?: string | undefined;
    username?: string | undefined;
    password?: string | undefined;

    constructor(data?: IRegisterDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.firstname = data["firstname"];
            this.name = data["name"];
            this.email = data["email"];
            this.username = data["username"];
            this.password = data["password"];
        }
    }

    static fromJS(data: any): RegisterDto {
        data = typeof data === 'object' ? data : {};
        let result = new RegisterDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["firstname"] = this.firstname;
        data["name"] = this.name;
        data["email"] = this.email;
        data["username"] = this.username;
        data["password"] = this.password;
        return data; 
    }

    clone(): RegisterDto {
        const json = this.toJSON();
        let result = new RegisterDto();
        result.init(json);
        return result;
    }
}

export interface IRegisterDto {
    firstname?: string | undefined;
    name?: string | undefined;
    email?: string | undefined;
    username?: string | undefined;
    password?: string | undefined;
}

export class RegisterResponse implements IRegisterResponse {
    status?: OpResult | undefined;

    constructor(data?: IRegisterResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.status = data["status"] ? OpResult.fromJS(data["status"]) : <any>undefined;
        }
    }

    static fromJS(data: any): RegisterResponse {
        data = typeof data === 'object' ? data : {};
        let result = new RegisterResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["status"] = this.status ? this.status.toJSON() : <any>undefined;
        return data; 
    }

    clone(): RegisterResponse {
        const json = this.toJSON();
        let result = new RegisterResponse();
        result.init(json);
        return result;
    }
}

export interface IRegisterResponse {
    status?: OpResult | undefined;
}

export class ConfirmResponse implements IConfirmResponse {
    status?: OpResult | undefined;

    constructor(data?: IConfirmResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.status = data["status"] ? OpResult.fromJS(data["status"]) : <any>undefined;
        }
    }

    static fromJS(data: any): ConfirmResponse {
        data = typeof data === 'object' ? data : {};
        let result = new ConfirmResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["status"] = this.status ? this.status.toJSON() : <any>undefined;
        return data; 
    }

    clone(): ConfirmResponse {
        const json = this.toJSON();
        let result = new ConfirmResponse();
        result.init(json);
        return result;
    }
}

export interface IConfirmResponse {
    status?: OpResult | undefined;
}

export class RecoverPasswordParams implements IRecoverPasswordParams {
    email?: string | undefined;
    username?: string | undefined;

    constructor(data?: IRecoverPasswordParams) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.email = data["email"];
            this.username = data["username"];
        }
    }

    static fromJS(data: any): RecoverPasswordParams {
        data = typeof data === 'object' ? data : {};
        let result = new RecoverPasswordParams();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["email"] = this.email;
        data["username"] = this.username;
        return data; 
    }

    clone(): RecoverPasswordParams {
        const json = this.toJSON();
        let result = new RecoverPasswordParams();
        result.init(json);
        return result;
    }
}

export interface IRecoverPasswordParams {
    email?: string | undefined;
    username?: string | undefined;
}

export class RecoverPasswordResponse implements IRecoverPasswordResponse {
    status?: OpResult | undefined;

    constructor(data?: IRecoverPasswordResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.status = data["status"] ? OpResult.fromJS(data["status"]) : <any>undefined;
        }
    }

    static fromJS(data: any): RecoverPasswordResponse {
        data = typeof data === 'object' ? data : {};
        let result = new RecoverPasswordResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["status"] = this.status ? this.status.toJSON() : <any>undefined;
        return data; 
    }

    clone(): RecoverPasswordResponse {
        const json = this.toJSON();
        let result = new RecoverPasswordResponse();
        result.init(json);
        return result;
    }
}

export interface IRecoverPasswordResponse {
    status?: OpResult | undefined;
}

export class RecoverUsernameParams implements IRecoverUsernameParams {
    email?: string | undefined;

    constructor(data?: IRecoverUsernameParams) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.email = data["email"];
        }
    }

    static fromJS(data: any): RecoverUsernameParams {
        data = typeof data === 'object' ? data : {};
        let result = new RecoverUsernameParams();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["email"] = this.email;
        return data; 
    }

    clone(): RecoverUsernameParams {
        const json = this.toJSON();
        let result = new RecoverUsernameParams();
        result.init(json);
        return result;
    }
}

export interface IRecoverUsernameParams {
    email?: string | undefined;
}

export class RecoverUsernameResponse implements IRecoverUsernameResponse {
    status?: OpResult | undefined;

    constructor(data?: IRecoverUsernameResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.status = data["status"] ? OpResult.fromJS(data["status"]) : <any>undefined;
        }
    }

    static fromJS(data: any): RecoverUsernameResponse {
        data = typeof data === 'object' ? data : {};
        let result = new RecoverUsernameResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["status"] = this.status ? this.status.toJSON() : <any>undefined;
        return data; 
    }

    clone(): RecoverUsernameResponse {
        const json = this.toJSON();
        let result = new RecoverUsernameResponse();
        result.init(json);
        return result;
    }
}

export interface IRecoverUsernameResponse {
    status?: OpResult | undefined;
}

export class SetPasswordParams implements ISetPasswordParams {
    code?: string | undefined;
    username?: string | undefined;
    password?: string | undefined;

    constructor(data?: ISetPasswordParams) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.code = data["code"];
            this.username = data["username"];
            this.password = data["password"];
        }
    }

    static fromJS(data: any): SetPasswordParams {
        data = typeof data === 'object' ? data : {};
        let result = new SetPasswordParams();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["code"] = this.code;
        data["username"] = this.username;
        data["password"] = this.password;
        return data; 
    }

    clone(): SetPasswordParams {
        const json = this.toJSON();
        let result = new SetPasswordParams();
        result.init(json);
        return result;
    }
}

export interface ISetPasswordParams {
    code?: string | undefined;
    username?: string | undefined;
    password?: string | undefined;
}

export class SetPasswordResponse implements ISetPasswordResponse {
    status?: OpResult | undefined;

    constructor(data?: ISetPasswordResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.status = data["status"] ? OpResult.fromJS(data["status"]) : <any>undefined;
        }
    }

    static fromJS(data: any): SetPasswordResponse {
        data = typeof data === 'object' ? data : {};
        let result = new SetPasswordResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["status"] = this.status ? this.status.toJSON() : <any>undefined;
        return data; 
    }

    clone(): SetPasswordResponse {
        const json = this.toJSON();
        let result = new SetPasswordResponse();
        result.init(json);
        return result;
    }
}

export interface ISetPasswordResponse {
    status?: OpResult | undefined;
}

export interface FileResponse {
    data: Blob;
    status: number;
    fileName?: string;
    headers?: { [name: string]: any };
}

export class SwaggerException extends Error {
    message: string;
    status: number; 
    response: string; 
    headers: { [key: string]: any; };
    result: any; 

    constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
        super();

        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }

    protected isSwaggerException = true;

    static isSwaggerException(obj: any): obj is SwaggerException {
        return obj.isSwaggerException === true;
    }
}

function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): Observable<any> {
    if(result !== null && result !== undefined)
        return _observableThrow(result);
    else
        return _observableThrow(new SwaggerException(message, status, response, headers, null));
}

function blobToText(blob: any): Observable<string> {
    return new Observable<string>((observer: any) => {
        if (!blob) {
            observer.next("");
            observer.complete();
        } else {
            let reader = new FileReader(); 
            reader.onload = function() { 
                observer.next(this.result);
                observer.complete();
            }
            reader.readAsText(blob); 
        }
    });
}