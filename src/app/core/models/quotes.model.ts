import { QuotesValues } from ".";

export class Quotes{
    public name: string;
    public value: QuotesValues[] = [];
    public logo: string;
    public key: string;
    public isRising: boolean;

    constructor({key,name,logo, time, value, isRising}: {key:string, name: string, logo:string,time: number, value: number, isRising: boolean}){
        this.name = name;
        this.logo = logo;
        this.key = key
        this.value.push(new QuotesValues({time, value}));
        this.isRising = isRising
    }
}

