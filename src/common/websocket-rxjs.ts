// RxJs wrapper for websocket
import { Observable, ReplaySubject } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import WebSocket from '../lib/isomorphic-ws';

export class WebSocketRxJs<T> {
  private webSocket: WebSocket;
  private data$ = new ReplaySubject<T>(1);
  private opened$ = new ReplaySubject<boolean>(1);

  constructor(url: string) {
    this.webSocket = new WebSocket(url);
    this.webSocket.onopen = (e) => { this.opened$.next(true); };
    this.webSocket.onclose = (e) => { this.opened$.next(false); };
    this.webSocket.onerror = (e) => { this.opened$.next(false); };
    this.webSocket.onmessage = (e) => {
      try {
        const data = JSON.parse(<string>e.data);
        this.data$.next(data);
      } catch (error) { }
    };
  }

  /**
   * @param url
   */
  message$(url: string): Observable<T> {
    return this.data$.asObservable();
  }

  /**
   * @param text
   */
  send(text: string) {
    // wait until socket open and send the text only once per call
    this.opened$.pipe(filter(opened => opened), take(1)).subscribe(() => {
      this.webSocket.send(text);
    });
  }
}
