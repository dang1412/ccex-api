import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

import { CandleStick } from '../../exchange-types';
import { getCandleStickUrl, adaptBitmexCandlestick, BitmexRestCandlestick } from './internal';

export class BitmexCandleStick {
  /**
   *
   * @param corsProxy
   * @param bitfinexWebsocket
   */
  constructor(private readonly corsProxy: string = '') {}

  /**
   *
   * @param pair
   * @param minutesFoot
   * @param start
   * @param end
   */
  fetchCandleStickRange$(pair: string, minutesFoot: number, start: number, end: number): Observable<CandleStick[]> {
    // https://www.bitmex.com/api/udf/history?symbol=EOSZ18&resolution=60&from=1544974016&to=1545578876
    // resolution = 1, 5, 60, D
    const originUrl = getCandleStickUrl(pair, minutesFoot, start, end);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    return ajax.getJSON<BitmexRestCandlestick>(url).pipe(map(adaptBitmexCandlestick));
  }
}
