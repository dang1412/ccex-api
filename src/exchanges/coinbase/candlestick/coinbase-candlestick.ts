import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { fetchRxjs } from '../../../common';
import { CandleStick } from '../../exchange-types';

import { getCandleStickUrl, adaptCoinbaseCandleStick } from './internal/functions';
import { CoinbaseRawCandleStick } from './internal/types';

export class CoinbaseCandleStick {
  private corsProxy: string;

  /**
   *
   * @param corsProxy
   */
  constructor(corsProxy?: string) {
    this.corsProxy = corsProxy;
  }

  fetchCandleStickRange$(pair: string, minutesFoot: number, start?: number, end?: number): Observable<CandleStick[]> {
    const originUrl = getCandleStickUrl(pair, minutesFoot, start, end);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    return fetchRxjs<CoinbaseRawCandleStick[]>(url).pipe(map(coinbaseCandles => coinbaseCandles.map(adaptCoinbaseCandleStick)));
  }
}
