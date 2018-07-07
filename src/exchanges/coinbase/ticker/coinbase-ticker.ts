import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { fetchRxjs } from '../../../common';
import { Ticker } from '../../exchange-types';
import { WebsocketRequest } from '../coinbase-common.types';
import { getProductId } from '../coinbase-common';
import { CoinbaseWebsocket } from '../coinbase-websocket';

import { adaptCoinbaseRawWsTicker, adaptCoinbaseRawRestTicker, getTickerUrl } from './internal/functions';
import { CoinbaseRawWsTicker, CoinbaseRawRestTicker } from './internal/types';

export class CoinbaseTicker {
  private corsProxy: string;
  private coinbaseWebsocket: CoinbaseWebsocket;

  constructor(corsProxy?: string, coinbaseWebsocket?: CoinbaseWebsocket) {
    this.corsProxy = corsProxy;
    this.coinbaseWebsocket = coinbaseWebsocket || new CoinbaseWebsocket();
  }

  fetchTicker$(pair: string): Observable<Ticker> {
    // receive rawTicker and adapt to Ticker here
    const originUrl = getTickerUrl(pair);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    return fetchRxjs<CoinbaseRawRestTicker>(url).pipe(map((rawRestTicker) => adaptCoinbaseRawRestTicker(rawRestTicker, pair)));
  }

  ticker$(pair: string): Observable<Ticker> {
    // receive rawTicker and adapt to Ticker here
    const request: WebsocketRequest = {
      type: 'subscribe',
      channels: ['ticker'],
      product_ids: [getProductId(pair)],
    };

    return this.coinbaseWebsocket
      .subscribe<CoinbaseRawWsTicker>(request)
      .pipe(map((rawTicker) => adaptCoinbaseRawWsTicker(rawTicker, pair)));
  }

  stopTicker(pair: string) {
    const request: WebsocketRequest = {
      type: 'unsubscribe',
      channels: ['ticker'],
      product_ids: [getProductId(pair)],
    };

    this.coinbaseWebsocket.unsubscribe(request);
  }
}
