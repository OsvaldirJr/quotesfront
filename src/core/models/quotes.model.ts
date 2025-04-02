export class Quotes{
    public name: string;
    public time: number[];

    constructor({name, time}: {name: string, time: number}){
        this.name = name;
        this.time = [time];
    }
}