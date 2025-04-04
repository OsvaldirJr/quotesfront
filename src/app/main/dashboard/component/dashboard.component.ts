import { Component, OnInit } from '@angular/core';
import { QuotesHubService } from '../../../core/services/quotes.hub.service';
import { map } from 'rxjs';
import { BrapiQuotes, Quotes, QuotesValues, Stokes } from '../../../core/models';
import { environment } from '../../../../environments/environment';
import { BrapiHttpService } from '../../../core/services/brapi.http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{ 
  protected dataList: any = [];
  protected quotesArray: Quotes[] = [];
  protected quotesList: Quotes[] = [];
  protected URL = environment.webSocketApi;
  private _tickers?: Stokes[];
  private _pageLength = 8;
  public selectedFilterButton?: 'rising' | 'falling';

  constructor(
    public webSocketService: QuotesHubService,
    public brapiHttpService: BrapiHttpService
  ) {}

  ngOnInit(): void {
    this._setTickersData()
    let webSocketConnection$ = this.webSocketService.connectSocket(this.URL);
    webSocketConnection$.subscribe((status) =>
      status ? this._webSocketMessageListener() : 'erro na conexão'
    );
  }

  private _sendWebSocketMessage() {
    this.webSocketService.sendMessage({ op: 'subscribe', args: 'trade' });
  }

  private _webSocketMessageListener() {
    this._sendWebSocketMessage();
    this.webSocketService
      .receiveMessages()
      .pipe(map((message: any) => this._setQuotesData(message)))
      .subscribe();
  }

  private _setQuotesData(data: any) {
    let name = Object.keys(data)[0];
    let results = this._tickers?.find(x=>x.stock == name);
    if(results){
      let time = data.timestamp;
      let value = Object.values(data)[0] as number
      value = value ? value : results.close!
      let quote = new Quotes({key: name,name: results?.name!,logo: results?.logo!, time, value})
      this._verifyValuesExistsAndSetNewValues(name, quote, time, value,results);
    }
  }

  private _verifyValuesExistsAndSetNewValues(name: string, quote: Quotes, time: any, value: number, result: Stokes) {
    if (!this.quotesArray.find(x => x.name == name)) {
      quote.isRising = result.change! > 0 
      this.quotesArray.push(quote);
      if(this.selectedFilterButton == 'rising') {
        this.quotesList= this.quotesArray.filter(x => x.isRising).slice(0,this._pageLength)
      } 
      else if(this.selectedFilterButton == 'falling'){ 
        this.quotesList=  this.quotesArray.filter(x => !x.isRising).slice(0,this._pageLength)
      }
      else{
        this.quotesList= this.quotesArray.slice(0,this._pageLength)
      }
    }
    else {
      this.quotesArray.forEach(x => {
        x.isRising =  result.close! < value;
        if (x.name == name) {
          x.value.push(new QuotesValues({ time, value }));
        }
      });
    }
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

    this.selectedFilterButton = selectedButton;
    // this.quotesList = selectedButton == 'rising' ? this.quotesArray.filter(x => x.isRising == false).slice(0,this._pageLength) : this.quotesArray.filter(x => !x.isRising ==true).slice(0,this._pageLength)
  }
}
