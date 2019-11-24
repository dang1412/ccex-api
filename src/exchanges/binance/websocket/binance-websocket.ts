import { Observable } from 'rxjs';

import { WebSocketRxJs } from '../../../common';
import { BinanceWebsocketMessage, BinanceWebscoketRequest } from './binance-websocket.type';
import { filter, map } from 'rxjs/operators';

const binanceWsEndpoint = 'wss://stream.binance.com:9443/stream';

export class BinanceWebsocket {
  private ws: WebSocketRxJs<BinanceWebsocketMessage> | null = null;

  subscribeChannel<T>(channel: string): Observable<T> {
    if (!this.ws) {
      this.ws = initWebsocket(binanceWsEndpoint);
    }

    const subcribeRequest: BinanceWebscoketRequest = {
      method: 'SUBSCRIBE',
      params: [channel],
      id: 1,
    }

    this.send(subcribeRequest);

    // TODO unsubscirbe stream

    return this.ws.message$.pipe(
      filter((message) => message.stream === channel),
      map((message) => message.data),
    )
  }

  unsubscribeChannel(channel: string): void {
    const unsubcribeRequest: BinanceWebscoketRequest = {
      method: 'UNSUBSCRIBE',
      params: [channel],
      id: 1,
    }

    this.send(unsubcribeRequest);
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
