import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

import { CandleStick } from '../../exchange-types';

import { getCandleStickUrl, adaptCoinbaseCandleStick } from './internal/functions';
import { CoinbaseRawCandleStick } from './internal/types';

export class CoinbaseCandleStick {
  private readonly corsProxy: string;

  /**
   *
   * @param corsProxy
   */
  constructor(corsProxy: string = '') {
    this.corsProxy = corsProxy;
  }

  fetchCandleStickRange$(pair: string, minutesFoot: number, start?: number, end?: number): Observable<CandleStick[]> {
    const originUrl = getCandleStickUrl(pair, minutesFoot, start, end);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    return ajax.getJSON<CoinbaseRawCandleStick[]>(url).pipe(
      map((coinbaseCandles) => coinbaseCandles.map(adaptCoinbaseCandleStick)),
      map((candles) => candles.sort((c1, c2) => c1.timestamp - c2.timestamp)),
    );
  }
}
