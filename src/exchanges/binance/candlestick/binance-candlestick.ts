import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { fetchRxjs, WebSocketRxJs } from '../../../common';
import { CandleStick } from '../../exchange-types';
import { BinanceRawRestCandle, BinanceRawWsCandle } from '../binance-types';
import { binanceCandleStickApiUrl, adaptBinanceRestCandle, adaptBinanceWsCandle, binanceCandleStickChannel } from '../binance-functions';

export class BinanceCandleStick {
  private pairStreamMap: { [pair: string]: Observable<CandleStick> } = {};
  private pairSocketMap: { [pair: string]: WebSocketRxJs } = {};
  private corsProxy = '';

  constructor(corsProxy?: string) {
    this.corsProxy = corsProxy;
  }

  fetchCandleStickRange$(pair: string, minutesFoot: number, start: number, end: number): Observable<CandleStick[]> {
    const originUrl = binanceCandleStickApiUrl(pair, minutesFoot, start, end);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    return fetchRxjs<BinanceRawRestCandle[]>(url).pipe(map(binanceCandles => binanceCandles.map(adaptBinanceRestCandle)));
  }

  candlestick$(pair: string, minutesFoot: number): Observable<CandleStick> {
    if (!this.pairStreamMap[pair]) {
      const channel = binanceCandleStickChannel(pair, minutesFoot);
      const ws = new WebSocketRxJs<BinanceRawWsCandle>(channel);
      this.pairStreamMap[pair] = ws.message$.pipe(map(binanceCandle => adaptBinanceWsCandle(binanceCandle)));
      this.pairSocketMap[pair] = ws;
    }

    return this.pairStreamMap[pair];
  }

  stopCandleStick(pair: string): void {
    if (this.pairSocketMap[pair]) {
      this.pairSocketMap[pair].close();
      delete this.pairSocketMap[pair];
    }

    if (this.pairStreamMap[pair]) {
      delete this.pairStreamMap[pair];
    }
  }
}
