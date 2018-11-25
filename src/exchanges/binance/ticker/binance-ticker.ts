import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { fetchRxjs, WebSocketRxJs } from '../../../common';
import { Ticker } from '../../exchange-types';
import { BinanceRawWsTicker, BinanceRawRestTicker } from './internal/types';
import { adaptBinanceWsTicker, adaptBinanceRestTicker, binanceTickerChannel, binanceTickerApiUrl } from './internal/functions';

export class BinanceTicker {
  private pairStreamMap: { [pair: string]: Observable<Ticker> } = {};
  private pairSocketMap: { [pair: string]: WebSocketRxJs } = {};
  private corsProxy: string;

  constructor(corsProxy = '') {
    this.corsProxy = corsProxy;
  }

  fetchTicker$(pair: string): Observable<Ticker> {
    const originUrl = binanceTickerApiUrl(pair);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    return fetchRxjs<BinanceRawRestTicker>(url).pipe(map((binanceTicker) => adaptBinanceRestTicker(binanceTicker, pair)));
  }

  ticker$(pair: string): Observable<Ticker> {
    if (!this.pairStreamMap[pair]) {
      const channel = binanceTickerChannel(pair);
      const ws = new WebSocketRxJs<BinanceRawWsTicker>(channel);
      this.pairStreamMap[pair] = ws.message$.pipe(map((binanceTicker) => adaptBinanceWsTicker(binanceTicker, pair)));
      this.pairSocketMap[pair] = ws;
    }

    return this.pairStreamMap[pair];
  }

  stopTicker(pair: string): void {
    if (this.pairSocketMap[pair]) {
      this.pairSocketMap[pair].close();
      delete this.pairSocketMap[pair];
    }

    if (this.pairStreamMap[pair]) {
      delete this.pairStreamMap[pair];
    }
  }
}
