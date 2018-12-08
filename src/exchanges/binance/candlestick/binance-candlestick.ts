import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { fetchRxjs, WebSocketRxJs } from '../../../common';
import { CandleStick } from '../../exchange-types';
import { BinanceRawRestCandle, BinanceRawWsCandle } from './internal/types';
import { binanceCandleStickApiUrl, adaptBinanceRestCandle, adaptBinanceWsCandle, binanceCandleStickChannel } from './internal/functions';

export class BinanceCandleStick {
  private readonly pairStreamMap: { [pair: string]: Observable<CandleStick> } = {};
  private readonly pairSocketMap: { [pair: string]: WebSocketRxJs } = {};
  private readonly corsProxy: string;

  constructor(corsProxy: string = '') {
    this.corsProxy = corsProxy;
  }

  fetchCandleStickRange$(pair: string, minutesFoot: number, start: number, end: number): Observable<CandleStick[]> {
    const originUrl = binanceCandleStickApiUrl(pair, minutesFoot, start, end);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    return fetchRxjs<BinanceRawRestCandle[]>(url).pipe(map((binanceCandles) => binanceCandles.map(adaptBinanceRestCandle)));
  }

  candlestick$(pair: string, minutesFoot: number): Observable<CandleStick> {
    const key = getKey(pair, minutesFoot);
    if (!this.pairStreamMap[key]) {
      const channel = binanceCandleStickChannel(pair, minutesFoot);
      const ws = new WebSocketRxJs<BinanceRawWsCandle>(channel);
      this.pairStreamMap[key] = ws.message$.pipe(map(adaptBinanceWsCandle));
      this.pairSocketMap[key] = ws;
    }

    return this.pairStreamMap[key];
  }

  stopCandleStick(pair: string, minutesFoot: number): void {
    const key = getKey(pair, minutesFoot);
    if (this.pairSocketMap[key]) {
      // stream associates with this socket also complete
      this.pairSocketMap[key].close();
      delete this.pairSocketMap[key];
    }

    if (this.pairStreamMap[key]) {
      delete this.pairStreamMap[key];
    }
  }
}

function getKey(pair: string, minutesFoot: number): string {
  return `${pair}${minutesFoot}`;
}
