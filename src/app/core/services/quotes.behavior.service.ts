import { Injectable } from "@angular/core";
import { Quotes } from "../models/quotes.model";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
  })
  export class QuotesBehaviorService {
    
    private _quotes : BehaviorSubject<Quotes[]> = new BehaviorSubject<Quotes[]>([]);
    public get quotes() : Observable<Quotes[]> {
        return this._quotes.asObservable();
    }
    
    public set quotes(v : Quotes[]) {
        this._quotes.next(v);
    }
    
  }