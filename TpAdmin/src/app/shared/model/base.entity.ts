export class BaseEntity {

    constructor(
        public createdAt: string = new Date().toString(),
        public createdBy: string = "",
        public modifiedAt: string = new Date().toString(),
        public modifiedBy: string = "") { }

    cloneFrom(o: any): this {
        return Object.assign(this, o);
    }
}