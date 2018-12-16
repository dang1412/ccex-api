import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { fetchRxjs } from '../../../common';
import { Ticker } from '../../exchange-types';
import { getSymbol } from '../bitfinex-common';
import { BitfinexWebsocket } from '../websocket';

import { adaptBitfinexTicker, getTickerApiUrl } from './internal/functions';
import { BitfinexRawTicker } from './internal/types';

export class BitfinexTicker {
  private readonly corsProxy: string;
  private readonly bitfinexWebsocket: BitfinexWebsocket;

  /**
   * @param corsProxy
   * @param bitfinexWebsocket
   */
  constructor(corsProxy: string = '', bitfinexWebsocket?: BitfinexWebsocket) {
    this.corsProxy = corsProxy;
    this.bitfinexWebsocket = bitfinexWebsocket || new BitfinexWebsocket();
  }

  fetchTicker$(pair: string): Observable<Ticker> {
    // https://api.bitfinex.com/v2/ticker/tBTCUSD
    const originUrl = getTickerApiUrl(pair);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    return fetchRxjs<BitfinexRawTicker>(url).pipe(map((rawTicker) => adaptBitfinexTicker(rawTicker, pair)));
  }

  ticker$(pair: string): Observable<Ticker> {
    // { "event": "subscribe", "channel": "ticker", "symbol": "tEOSETH" }
    const subscribeRequest = {
      event: 'subscribe' as 'subscribe',
      channel: 'ticker',
      symbol: getSymbol(pair),
    };

    return this.bitfinexWebsocket
      .sendRequest<BitfinexRawTicker>(subscribeRequest)
      .pipe(map((rawTicker) => adaptBitfinexTicker(rawTicker, pair)));
  }

  stopTicker(pair: string): void {
    const unsubscribeRequest = {
      event: 'unsubscribe' as 'unsubscribe',
      channel: 'ticker',
      symbol: getSymbol(pair),
    };

    this.bitfinexWebsocket.sendRequest(unsubscribeRequest);
  }
}
