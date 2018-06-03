import { Observable, empty } from 'rxjs';

import { Ticker } from '../exchange-types';
import { CoinbaseRawTicker, WebsocketSubscribeRequest, WebsocketUnSubscribeRequest } from './coinbase-types';
import { adaptCoinbaseRawTicker, getProductId } from './coinbase-functions';
import { CoinbaseWebsocket } from './coinbase-websocket';
import { map } from 'rxjs/operators';

export class CoinbaseTicker {
  private coinbaseWs: CoinbaseWebsocket;

  constructor(coinbaseWs: CoinbaseWebsocket) {
    this.coinbaseWs = coinbaseWs;
  }

  fetchTicker$(pair: string): Observable<Ticker> {
    // receive rawTicker and adapt to Ticker here
    return empty();
  }

  ticker$(pair: string): Observable<Ticker> {
    // receive rawTicker and adapt to Ticker here
    const request: WebsocketSubscribeRequest = {
      type: 'subscribe',
      channels: ['ticker'],
      product_ids: [getProductId(pair)]
    };

    return this.coinbaseWs.subscribe<CoinbaseRawTicker>(request).pipe(map((rawTicker) => adaptCoinbaseRawTicker(rawTicker, pair)));
  }

  stopTicker(pair: string) {
    const request: WebsocketUnSubscribeRequest = {
      type: 'unsubscribe',
      channels: ['ticker'],
      product_ids: [getProductId(pair)]
    }

    this.coinbaseWs.unsubscribe(request);
  }
}
