import { ReplaySubject, Observable } from 'rxjs';
import { ExchangeWebsocket } from '../../exchange-websocket.abstract';
import { wsEndpoint } from '../bitmex-common';
import { WebsocketRequest, WebsocketResponse, WebsocketData } from './types';

export class BitmexWebsocket extends ExchangeWebsocket<WebsocketRequest, WebsocketResponse | WebsocketData> {
  private readonly keyStreamMap = new Map<string, ReplaySubject<WebsocketData>>();

  constructor(endPoint?: string) {
    super(endPoint || wsEndpoint);
  }

  /**
   * handle message
   *
   * @param message
   */
  handleMessage(message: WebsocketResponse | WebsocketData): void {
    // console.log('handleMessage ==>', message);
    const wsData = message as WebsocketData;
    if (wsData.table) {
      const symbol = wsData.data && wsData.data.length ? wsData.data[0].symbol : '';
      const key = `${wsData.table}:${symbol}`;
      const stream = this.keyStreamMap.get(key);
      if (stream) {
        stream.next(wsData);
      }
    }
  }

  // {"op": "subscribe", "args": "orderBookL2_25:XBTUSD"}
  subscribe<T>(args: string): Observable<WebsocketData<T>> {
    let stream = this.keyStreamMap.get(args);

    if (!stream) {
      stream = new ReplaySubject<WebsocketData<T>>(1);
      this.keyStreamMap.set(args, stream);
    }

    this.send({ op: 'subscribe', args });

    return stream.asObservable();
  }

  /**
   * Unsubscribe channel
   *
   * @param arg
   */
  unsubscribe(arg: string): void {
    const stream = this.keyStreamMap.get(arg);
    if (stream) {
      stream.complete();
      this.keyStreamMap.delete(arg);
      this.send({ op: 'unsubscribe', args: arg });
    }

    // TODO handle when unsubscribe complete
  }

  onDestroy(): void {
    // TODO complete all streams
    // clear stream map and key map
    this.keyStreamMap.clear();
  }
}
