import { Component, OnInit } from '@angular/core';
import { QuotesHubService } from '@core/services/quotes.hub.service';
import { map } from 'rxjs';
import { BrapiQuotes, Quotes, QuotesValues, Stokes } from '@core/models';
import { environment } from 'src/environments/environment';
import { BrapiHttpService } from '@core/services/brapi.http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{ 
  protected dataList: any = [];
  protected quotesArray: Quotes[] = [];
  protected quotesList: Quotes[] = [];
  private _tickers?: Stokes[];
  private _pageLength = 8;
  public selectedFilterButton?: 'rising' | 'falling';

  constructor(
    public webSocketService: QuotesHubService,
    public brapiHttpService: BrapiHttpService
  ) {}

  ngOnInit(): void {
    this._setTickersData()
    this._webSocketMessageListener();
  }

  private _webSocketMessageListener() {
    this.webSocketService
      .receiveMessages()
      .pipe(map((message: any) => this._setQuotesData(message)))
      .subscribe();
  }

  private _setQuotesData(data: any) {
    const name = Object.keys(data)[0];
    let tickers = this._tickers?.find(x=>x.stock == name);
    if(tickers){
      let time = data.timestamp;
      let value = Object.values(data)[0] as number
      let quote = new Quotes({key: name,name: tickers?.name!,logo: tickers?.logo!, time, value})
      this._verifyValuesExistsAndSetNewValues(name, quote, time, value,tickers);
    }
  }

  private _verifyValuesExistsAndSetNewValues(name: string, quote: Quotes, time: any, value: number, result: Stokes) {
    if (!this.quotesArray.find(x => x.key == name)) {
      quote.isRising = result.change! > 0 
      this.quotesArray.push(quote);
      this._extractAndPaginateList();
      return;
    }
    
    this.quotesArray.forEach(x => {
      x.isRising =  result.close! < value;
      if (x.name == name) {
        x.value.push(new QuotesValues({ time, value: value-1 }));
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
