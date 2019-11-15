import fetch from 'node-fetch';

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
  async fetchCandleStickRange(pair: string, minutesFoot: number, start: number, end: number): Promise<CandleStick[]> {
    // https://www.bitmex.com/api/udf/history?symbol=EOSZ18&resolution=60&from=1544974016&to=1545578876
    // resolution = 1, 5, 60, D
    const originUrl = getCandleStickUrl(pair, minutesFoot, start, end);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    const candlestick: BitmexRestCandlestick = await fetch(url).then(res => res.json());

    return adaptBitmexCandlestick(candlestick);
  }
}
