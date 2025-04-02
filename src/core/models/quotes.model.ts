export class Quotes{
    public name: string;
    public value: QuotesValues[];

    constructor({name, time, value}: {name: string, time: number, value: number}){
        this.name = name;
        this.value = [new QuotesValues({time, value})];
    }
}

export class QuotesValues{
    public time: number
    public value: number
    constructor({time, value}: {time: number, value: number}){
        this.time = time;
        this.value = value;
    }
}