import fetch from 'node-fetch';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Ticker } from '../../exchange-types';
import { BinanceWsTicker, BinanceRestTicker } from './internal/types';
import { adaptBinanceWsTicker, adaptBinanceRestTicker, binanceTickerApiUrl, getTickerChannel } from './internal/functions';
import { BinanceWebsocket } from '../websocket';

export class BinanceTicker {
  /**
   *
   * @param binanceWebsocket
   * @param corsProxy
   */
  constructor(private readonly binanceWebsocket: BinanceWebsocket, private readonly corsProxy: string = '') {}

  async fetch(pair: string): Promise<Ticker> {
    const originUrl = binanceTickerApiUrl(pair);
    const url = this.corsProxy ? `${this.corsProxy}${originUrl}` : originUrl;

    const rawTicker: BinanceRestTicker = await fetch(url).then(res => res.json());

    return adaptBinanceRestTicker(rawTicker, pair);
  }

  stream$(pair: string): Observable<Ticker> {
    const channel = getTickerChannel(pair);

    return this.binanceWebsocket.subscribeChannel<BinanceWsTicker>(channel).pipe(
      map((binanceTicker) => adaptBinanceWsTicker(binanceTicker, pair)),
    )
  }

  stop(pair: string): void {
    this.binanceWebsocket.unsubscribeChannel(pair);
  }
}
