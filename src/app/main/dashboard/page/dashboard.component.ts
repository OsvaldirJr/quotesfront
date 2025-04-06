import { Component, OnInit } from '@angular/core';
import { Subject, debounceTime, map, takeUntil } from 'rxjs';
import { BrapiQuotes, Quotes, QuotesValues, Stock } from '@core/models';
import { BrapiHttpService, QuotesHubService } from '@core/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: false
})
export class DashboardComponent implements OnInit{ 
  public quotesArray: Quotes[] = [];
  public quotesList: Quotes[] = [];
  private _tickers?: Stock[];
  private _pageLength = 8;
  public selectedFilterButton?: 'rising' | 'falling';
  private _destroy$: Subject<any> = new Subject<any>();

  constructor(
    public webSocketService: QuotesHubService,
    public brapiHttpService: BrapiHttpService
  ) {}

  ngOnInit(): void {
    this._setTickersData()
    this._webSocketMessageListener();
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  private _webSocketMessageListener() {
    this.webSocketService
      .receiveMessages()
      .pipe(takeUntil(this._destroy$) ,debounceTime(10), map((message: any) => this._setQuotesData(message)))
      .subscribe();
  }

  private _setQuotesData(data: any) {
    const name = Object.keys(data)[0];
    const tickers = this._tickers?.find(x=>x.stock == name);
    if(tickers){
      const time = data.timestamp;
      const value = Object.values(data)[0] as number
      const quote = new Quotes({key: name,name: tickers?.name!,logo: tickers?.logo!, time, value, isRising: true})
      this._verifyValuesExistsAndSetNewValues(name, quote, time, value,tickers);
    }
  }

  private _verifyValuesExistsAndSetNewValues(name: string, quote: Quotes, time: any, value: number, result: Stock) {
    if (!this.quotesArray.find(x => x.key == name)) {
      quote.isRising = result.change! > 0 
      this.quotesArray.push(quote);
      this._extractAndPaginateList();
      return;
    }

    this.quotesArray.forEach(x => {
      x.isRising =  result.close! < value;
      if (x.key == name) {
        x.value.push(new QuotesValues({ time, value: value }));
      }
      
    });

    this._extractAndPaginateList();
  }

  private _extractAndPaginateList() {
    if (this.selectedFilterButton == 'rising') {
      this.quotesList = this.quotesArray.filter(x => x.isRising).slice(0, this._pageLength);
      return;
    }

    if (this.selectedFilterButton == 'falling') {
      this.quotesList = this.quotesArray.filter(x => !x.isRising).slice(0, this._pageLength);
      return;
    }
    
    this.quotesList = this.quotesArray.slice(0, this._pageLength);
  }

  private _setTickersData() {
    this.brapiHttpService.getQuotes().subscribe({
      next:(tickers: BrapiQuotes)=>{
        this._tickers = tickers.stocks;
      }
    })
  }
  public paginate(){
    this._pageLength += 8; 
    this.quotesList= this.quotesArray.slice(0,this._pageLength)
  }

  public changeFilter(selectedButton: 'rising' | 'falling'){
    if( this.selectedFilterButton == selectedButton){
      this.selectedFilterButton = undefined;
      this.quotesList = this.quotesArray.slice(0,this._pageLength);
      return;
    }

    this.selectedFilterButton = selectedButton;
    this.quotesList = selectedButton == 'rising' ? this.quotesArray.filter(x => x.isRising).slice(0,this._pageLength) : this.quotesArray.filter(x => !x.isRising).slice(0,this._pageLength)
  }
}