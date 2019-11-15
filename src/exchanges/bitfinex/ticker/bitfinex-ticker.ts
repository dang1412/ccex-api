import fetch from 'node-fetch';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Ticker } from '../../exchange-types';
import { getSymbol } from '../bitfinex-common';
import { BitfinexWebsocket } from '../websocket';

import { adaptBitfinexTicker, getTickerApiUrl } from './internal/functions';
import { BitfinexRawTicker } from './internal/types';

export class BitfinexTicker {
  /**
   * @param corsProxy
   * @param bitfinexWebsocket
   */
  constructor(private readonly corsProxy: string = '', private readonly bitfinexWebsocket: BitfinexWebsocket) {}

  async fetchTicker(pair: string): Promise<Ticker> {
    // https://api.bitfinex.com/v2/ticker/tBTCUSD
    const originUrl = getTickerApiUrl(pair);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    const rawTicker: BitfinexRawTicker = await fetch(url).then(res => res.json());

    return adaptBitfinexTicker(rawTicker, pair);
  }

  ticker$(pair: string): Observable<Ticker> {
    // { "event": "subscribe", "channel": "ticker", "symbol": "tEOSETH" }
    const subscribeRequest = {
      channel: 'ticker',
      symbol: getSymbol(pair),
    };

    return this.bitfinexWebsocket
      .subscribeChannel<BitfinexRawTicker>(subscribeRequest)
      .pipe(map((rawTicker) => adaptBitfinexTicker(rawTicker, pair)));
  }

  stopTicker(pair: string): void {
    const unsubscribeRequest = {
      channel: 'ticker',
      symbol: getSymbol(pair),
    };

    this.bitfinexWebsocket.unsubscribeChannel(unsubscribeRequest);
  }
}
