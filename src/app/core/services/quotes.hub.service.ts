import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuotesHubService {
  webSocketSubject = new Subject<any>();

  constructor() {
    this.connectSocket(environment.webSocketApi)
  }

  connectSocket(webSocketUrl: string): void {
    const socket = webSocket<any>(webSocketUrl);
      this.webSocketSubject = socket;
      this.webSocketSubject.next({ op: 'subscribe', args: 'trade' })
  }

  sendMessage(body: Object) {
    this.webSocketSubject.next(body);
  }

  receiveMessages(): Observable<any> {
    return this.webSocketSubject;
  }

  disconnectSocket() {
    this.webSocketSubject.complete();
  }
}