import fetch from 'node-fetch';

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
  private readonly corsProxy: string;
  private readonly coinbaseWebsocket: CoinbaseWebsocket;

  constructor(corsProxy: string = '', coinbaseWebsocket?: CoinbaseWebsocket) {
    this.corsProxy = corsProxy;
    this.coinbaseWebsocket = coinbaseWebsocket || new CoinbaseWebsocket();
  }

  async fetchTicker(pair: string): Promise<Ticker> {
    // receive rawTicker and adapt to Ticker here
    const originUrl = getTickerUrl(pair);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    const rawTicker: CoinbaseRawRestTicker = await fetch(url).then(res => res.json());

    return adaptCoinbaseRawRestTicker(rawTicker, pair)
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

  stopTicker(pair: string): void {
    const request: WebsocketRequest = {
      type: 'unsubscribe',
      channels: ['ticker'],
      product_ids: [getProductId(pair)],
    };

    this.coinbaseWebsocket.unsubscribe(request);
  }
}
