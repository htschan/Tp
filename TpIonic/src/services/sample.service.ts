// src/services/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, RequestMethod } from '@angular/http';

const options = new RequestOptions({
    method: RequestMethod.Get,
    url: 'http://localhost:5000/api/v1/SampleData/WeatherForecasts'
  });

@Injectable()
export class SampleService {

    sampleData: any = {};

    constructor(private http: Http) {
    }

    getSample()/*: Observable<any>*/ {
        // return this.http.get('https://api.timepuncher.ch/SampleData/WeatherForecasts').map((res: Response) => res.json());
        return this.http.get('SampleData/WeatherForecasts',  options).map((res: Response) => res.json()).subscribe(data => {console.log(data); this.sampleData = data;});
    }
//{{sampleService.getSample() | async}}
}
