import { QuotesValues } from ".";

export class Quotes{
    public name: string;
    public value: QuotesValues[];
    public logo: string;
    public key: string;
    public isRising: boolean = true;

    constructor({key,name,logo, time, value}: {key:string, name: string, logo:string,time: number, value: number}){
        this.name = name;
        this.logo = logo;
        this.key = key
        this.value = [new QuotesValues({time, value})];
    }
}

