import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class QuotesHubService {
  webSocketSubject = new Subject<any>();

  constructor() {}

  connectSocket(webSocketUrl: string): Observable<any> {
    try {
      this.webSocketSubject = webSocket(webSocketUrl);
      this.webSocketSubject.next({ op: 'subscribe', args: 'trade' })
    } catch {
      return of(false);
    }
    return of(true);
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