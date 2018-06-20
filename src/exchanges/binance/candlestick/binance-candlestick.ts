import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { fetchRxjs } from '../../../common';
import { CandleStick } from '../../exchange-types';
import { BinanceRawRestCandle } from '../binance-types';
import { binanceCandleStickApiUrl, adaptBinanceRestCandle } from '../binance-functions';

export class BinanceCandleStick {
  private corsProxy = '';

  constructor(corsProxy?: string) {
    this.corsProxy = corsProxy;
  }

  fetchCandleStickRange$(pair: string, minutesFoot: number, start: number, end: number): Observable<CandleStick[]> {
    const originUrl = binanceCandleStickApiUrl(pair, minutesFoot, start, end);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    console.log(url);

    return fetchRxjs<BinanceRawRestCandle[]>(url).pipe(map(binanceCandles => binanceCandles.map(adaptBinanceRestCandle)));
  }
}
