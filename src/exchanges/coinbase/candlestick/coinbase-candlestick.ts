import fetch from 'node-fetch';

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

  async fetchCandleStickRange(pair: string, minutesFoot: number, start?: number, end?: number): Promise<CandleStick[]> {
    const originUrl = getCandleStickUrl(pair, minutesFoot, start, end);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    const rawCandlesticks: CoinbaseRawCandleStick[] = await fetch(url).then(res => res.json());

    return rawCandlesticks.map(adaptCoinbaseCandleStick).sort((c1, c2) => c1.timestamp - c2.timestamp);
  }
}
