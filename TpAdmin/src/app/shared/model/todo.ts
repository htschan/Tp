import { BaseEntity } from './base.entity';

export class Todo extends BaseEntity {
    title: string;
    comment: string;
    finished: boolean;
    owner: string;
    prio: number;

    constructor(title: string = "neues Todo", comment?: string, finished?: boolean, timestamp?: string, createdBy?: string) {
        super(timestamp, createdBy);
        this.title = title;
        this.comment = comment;
        this.finished = finished;
    }

    cloneFrom(o: any): this {
        return Object.assign(this, o);
    }
}