import fetch from 'node-fetch';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { fetchRxjs } from '../../../common';
import { Trade } from '../../exchange-types';
import { WebsocketRequest } from '../coinbase-common.types';
import { getProductId } from '../coinbase-common';
import { CoinbaseWebsocket } from '../coinbase-websocket';

import { adaptCoinbaseRawTrade, getTradesUrl } from './internal/functions';
import { CoinbaseRawWsTrade, CoinbaseRawRestTrade } from './internal/types';

export class CoinbaseTrade {
  private readonly corsProxy: string;
  private readonly coinbaseWebsocket: CoinbaseWebsocket;

  /**
   *
   * @param corsProxy
   * @param coinbaseWebsocket
   */
  constructor(corsProxy: string = '', coinbaseWebsocket?: CoinbaseWebsocket) {
    this.corsProxy = corsProxy;
    this.coinbaseWebsocket = coinbaseWebsocket || new CoinbaseWebsocket();
  }

  // fetch trades
  async fetchTrades(pair: string): Promise<Trade[]> {
    const originUrl = getTradesUrl(pair);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    const rawTrades: CoinbaseRawRestTrade[] = await fetch(url).then(res => res.json());

    return rawTrades.map(adaptCoinbaseRawTrade);
  }

  trade$(pair: string): Observable<Trade> {
    const request: WebsocketRequest = {
      type: 'subscribe',
      channels: ['matches'],
      product_ids: [getProductId(pair)],
    };

    return this.coinbaseWebsocket.subscribe<CoinbaseRawWsTrade>(request).pipe(map(adaptCoinbaseRawTrade));
  }

  stopTrade(pair: string): void {
    const request: WebsocketRequest = {
      type: 'unsubscribe',
      channels: ['matches'],
      product_ids: [getProductId(pair)],
    };

    this.coinbaseWebsocket.unsubscribe(request);
  }
}
