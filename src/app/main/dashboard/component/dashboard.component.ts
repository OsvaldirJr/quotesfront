import { Component, OnInit } from '@angular/core';
import { QuotesHubService } from '../../../../core/services/quotes.hub.service';
import { debounceTime, map } from 'rxjs';
import { Quotes, QuotesValues } from '../../../../core/models/quotes.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{ 
  dataList: any = [];
  quotesArray: Quotes[] = [];
  URL = 'http://localhost:8080/quotes';

  constructor(
    public webSocketService: QuotesHubService 
  ) {}

  ngOnInit(): void {

    // let webSocketConnection$ = this.webSocketService.connectSocket(this.URL);
    // webSocketConnection$.subscribe((status) =>
    //   status ? this.messageListener() : 'erro na conexão'
    // );
  }

  sendMessage() {
    this.webSocketService.sendMessage({ op: 'subscribe', args: 'trade' });
  }

  messageListener() {
    this.sendMessage();
    this.webSocketService
      .receiveMessages()
      .pipe(map((message: any) => this.setData(message)))
      .subscribe();
  }

  setData(data: any) {
    let name = Object.keys(data)[0];
    let time = data.timestamp;
    let value = Object.values(data)[0] as number
    let quote = new Quotes({name, time, value})
    if(!this.quotesArray.find(x=>x.name == name)){
      this.quotesArray.push(quote)
    }
    else{
      this.quotesArray.forEach(x=>{
        if(x.name == name){
          x.value.push(new QuotesValues({time, value}))
        }
      })
      
    }
    console.log(this.quotesArray)
  }
}
