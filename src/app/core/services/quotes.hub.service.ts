import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil, interval, throttle} from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuotesHubService implements OnDestroy {
  webSocketSubject = new Subject<any>();
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor() {
    this.connectSocket(environment.webSocketApi)
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
    this.disconnectSocket();
  }

  connectSocket(webSocketUrl: string): void {
    const socket = webSocket({
      url: webSocketUrl,
      openObserver: {
        next: () => {
          console.log('Connection ok');
        }
      },
      closingObserver:{
        next: () => {
          console.log('Connection closed');
        }
      },
      deserializer: ({ data }) => data
    });

    socket.pipe(throttle(() => interval(1000)), takeUntil(this._destroy$)).subscribe(
      {
      next:(message)=>{
        this.webSocketSubject.next(JSON.parse(message))
      },
      error:(e)=>{
        console.error('Error: ', e)
      }
    });
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