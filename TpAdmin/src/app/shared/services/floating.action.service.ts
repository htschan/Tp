import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

// Parent and children communicate via service
// https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service

@Injectable()
export class FloatingActionService {

    private _fab1Show = false;
    private _fab1Icon: string;

    private fab1SourceClicked = new Subject<string>();

    setFab1(show: boolean, iconLigature: string = "") {
        this._fab1Show = show;
        this._fab1Icon = iconLigature;
    }

    fab1Clicked$ = this.fab1SourceClicked.asObservable();

    fab1Clicked() {
        this.fab1SourceClicked.next("fab1Clicked");
    }

    get fab1Show() {
        return this._fab1Show;
    }

    get fab1Icon() {
        return this._fab1Icon;
    }
}
