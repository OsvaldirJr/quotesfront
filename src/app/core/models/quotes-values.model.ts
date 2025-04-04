export class QuotesValues{
    public time: number
    public value: number
    constructor({time, value}: {time: number, value: number}){
        this.time = time;
        this.value = value;
    }
}