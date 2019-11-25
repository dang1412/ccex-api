import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { WebSocketRxJs } from '../../../common';
import { BinanceWebsocketMessage, BinanceWebscoketRequest } from './binance-websocket.type';

const binanceWsEndpoint = 'wss://stream.binance.com:9443/stream';

export class BinanceWebsocket {
  private ws: WebSocketRxJs<BinanceWebsocketMessage> | null = null;
  private readonly cache = new Map<string, Observable<any>>();

  subscribeChannel<T>(channel: string): Observable<T> {
    if (!this.ws) {
      this.ws = initWebsocket(binanceWsEndpoint);
    }

    const cached$ = this.cache.get(channel);
    if (cached$) {
      return cached$;
    }

    const subcribeRequest: BinanceWebscoketRequest = {
      method: 'SUBSCRIBE',
      params: [channel],
      id: 1,
    }

    this.send(subcribeRequest);

    // TODO unsubscirbe stream

    const data$ = this.ws.message$.pipe(
      filter((message) => message.stream === channel),
      map((message) => message.data),
    );

    // cache
    this.cache.set(channel, data$);

    return data$;
  }

  unsubscribeChannel(channel: string): void {
    const unsubcribeRequest: BinanceWebscoketRequest = {
      method: 'UNSUBSCRIBE',
      params: [channel],
      id: 1,
    }

    this.send(unsubcribeRequest);
    this.cache.delete(channel);
  }

  private send(req: BinanceWebscoketRequest): void {
    if (this.ws) {
      this.ws.send(JSON.stringify(req));
    }
  }
}

function initWebsocket(wsEndpoint: string): WebSocketRxJs<BinanceWebsocketMessage> {
  return new WebSocketRxJs<BinanceWebsocketMessage>(wsEndpoint);
}
