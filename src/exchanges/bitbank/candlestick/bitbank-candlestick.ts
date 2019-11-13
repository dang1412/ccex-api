import fetch from 'node-fetch';

import { CandleStick } from '../../exchange-types';
import { publicUrl, RawData } from '../bitbank-common';

import {
  adaptBitbankCandle,
  convertTimestampToCandleFoot,
  getTimestringArrayFromRange,
  isLatestTimestring,
  eliminateRedundantCandles,
} from './internal/functions';
import { BitbankRawCandlesticks } from './internal/types';

const candleFileCaches: { [key: string]: CandleStick[] } = {};

export class BitbankCandlestick {
  /**
   * @param pair
   * @param timestamp
   * @param minutesFoot (resolution)
   */
  async getApproximateHistoryPrice(pair: string, timestamp: number, minutesFoot: number): Promise<number> {
    const candleTimestamp = convertTimestampToCandleFoot(timestamp, minutesFoot);

    const candles = await this.fetchCandleStickRange(pair, minutesFoot, candleTimestamp, candleTimestamp);
    const foundCandle = candles.find((candle) => candle.timestamp === candleTimestamp);

    return foundCandle ? foundCandle.close : 0;
  }

  /**
   * @param pair
   * @param minutesFoot
   * @param start
   * @param end
   */
  async fetchCandleStickRange(pair: string, minutesFoot: number, start: number, end?: number): Promise<CandleStick[]> {
    const minutesToResolution: { [key: number]: string } = {
      1: '1min',
      5: '5min',
      15: '15min',
      30: '30min',
      60: '1hour',
      240: '4hour',
      1440: '1day',
    };
    const endAdjusted = end || Date.now();
    const resolution = minutesToResolution[minutesFoot] || '1hour';
    const timestrArray = getTimestringArrayFromRange(resolution, start, endAdjusted);

    const requestArray = timestrArray.map((timestr) => fetchAndCacheCandleStick(pair, resolution, timestr));

    const results = await Promise.all(requestArray);
    const candles: CandleStick[] = Array.prototype.concat.apply([], results);

    return eliminateRedundantCandles(candles, start, end);
  }
}
// TODO move to internal
/**
 *
 * @param pair
 * @param resolution
 * @param timeString
 */
async function fetchAndCacheCandleStick(pair: string, resolution: string, timeString: string): Promise<CandleStick[]> {
  const key = pair + resolution + timeString;
  if (candleFileCaches[key]) {
    return Promise.resolve(candleFileCaches[key]);
  }

  const candles = await fetchCandleStickFile(pair, resolution, timeString);
  if (candles && candles.length && !isLatestTimestring(timeString)) {
    candleFileCaches[key] = candles;
  }

  return candles;
}

/**
 *
 * @param pair
 * @param resolution
 * @param timeString
 */
async function fetchCandleStickFile(pair: string, resolution: string, timeString: string): Promise<CandleStick[]> {
  const url = `${publicUrl}/${pair}/candlestick/${resolution}/${timeString}`;
  const raw: RawData<BitbankRawCandlesticks> = await fetch(url).then(res => res.json());

  return raw.data.candlestick[0].ohlcv.map(adaptBitbankCandle);
}
