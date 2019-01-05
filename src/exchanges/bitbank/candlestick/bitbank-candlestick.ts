import { Observable, forkJoin, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

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
  getApproximateHistoryPrice(pair: string, timestamp: number, minutesFoot: number): Observable<number> {
    const candleTimestamp = convertTimestampToCandleFoot(timestamp, minutesFoot);

    return this.fetchCandleStickRange$(pair, minutesFoot, candleTimestamp, candleTimestamp).pipe(
      map((candles) => {
        const foundCandle = candles.find((candle) => candle.timestamp === candleTimestamp);

        return foundCandle ? foundCandle.close : 0;
      }),
    );
  }

  /**
   * @param pair
   * @param minutesFoot
   * @param start
   * @param end
   */
  fetchCandleStickRange$(pair: string, minutesFoot: number, start: number, end?: number): Observable<CandleStick[]> {
    const minutesToResolution: {[key: number]: string} = {
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

    const requestArray = timestrArray.map((timestr) => fetchAndCacheCandleStick$(pair, resolution, timestr));

    return forkJoin(requestArray).pipe(
      map((results) => Array.prototype.concat.apply([], results)),
      map((candles) => eliminateRedundantCandles(candles, start, end)),
    );
  }
}
// TODO move to internal
/**
 *
 * @param pair
 * @param resolution
 * @param timeString
 */
function fetchAndCacheCandleStick$(pair: string, resolution: string, timeString: string): Observable < CandleStick[] > {
  const key = pair + resolution + timeString;
  if(candleFileCaches[key]) {
    return of(candleFileCaches[key]);
  }

    return fetchCandleStickFile$(pair, resolution, timeString).pipe(
    tap((candles) => {
      // cache file request result if it is not newest file
      if (candles && candles.length && !isLatestTimestring(timeString)) {
        candleFileCaches[key] = candles;
      }
    }),
  );
}

/**
 *
 * @param pair
 * @param resolution
 * @param timeString
 */
function fetchCandleStickFile$(pair: string, resolution: string, timeString: string): Observable < CandleStick[] > {
  const url = `${publicUrl}/${pair}/candlestick/${resolution}/${timeString}`;

  return ajax.getJSON<RawData<BitbankRawCandlesticks>>(url).pipe(map((raw) => raw.data.candlestick[0].ohlcv.map(adaptBitbankCandle)));
}
