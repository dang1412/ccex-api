import { Observable, forkJoin, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

// import { PubnubRxJs } from '../../common/pubnub-rxjs';
import { CandleStick } from '../exchange.type';
import { Bitbank } from './bitbank';
import { publicUrl, BitbankRawCandlesticks } from './bitbank-common';
import { adaptBitbankCandle, convertTimestampToCandleFoot, getTimeStrArrayFromRange, isLatestTime } from './bitbank-functions';

const candleFileCaches: { [key: string]: CandleStick[] } = {};

const minutesToResolution = {
  1: '1min',
  5: '5min',
  15: '15min',
  30: '30min',
  60: '1hour',
  240: '4hour',
  1440: '1day',
};

export class BitbankCandlestick {
  private bitbank: Bitbank;

  constructor(bitbank: Bitbank) {
    this.bitbank = bitbank;
  }

  /**
   * @param pair
   * @param timestamp
   * @param minutesFoot (resolution)
   */
  getApproximateHistoryPrice(pair: string, timestamp: number, minutesFoot: number): Observable<number> {
    const candleTimestamp = convertTimestampToCandleFoot(timestamp, minutesFoot);
    return this.fetchCandleStickRange$(pair, minutesFoot, candleTimestamp, candleTimestamp).pipe(
      map(candles => {
        const candle = candles.find(_candle => _candle.timestamp === candleTimestamp);
        return candle ? candle.close : 0;
      })
    );
  }

  /**
   * 
   * @param pair 
   * @param minutesFoot 
   * @param start 
   * @param end 
   */
  fetchCandleStickRange$(pair: string, minutesFoot: number, start: number, end: number): Observable<CandleStick[]> {
    const resolution = minutesToResolution[minutesFoot] || '1hour';
    const timestrArray = getTimeStrArrayFromRange(resolution, start, end);

    const requestArray = timestrArray.map(timestr => this.fetchAndCacheCandleStick$(pair, resolution, timestr));
    return forkJoin(...requestArray).pipe(
      map(results => Array.prototype.concat.apply([], results))
    );
  }

  /**
   * 
   * @param pair 
   * @param resolution 
   * @param timeString 
   */
  private fetchAndCacheCandleStick$(pair: string, resolution: string, timeString: string): Observable<CandleStick[]> {
    const key = pair + resolution + timeString;
    if (candleFileCaches[key]) {
      return of(candleFileCaches[key]);
    }

    return this.fetchCandleStickFile$(pair, resolution, timeString).pipe(
      tap(candles => {
        // cache file request result if it is not newest file
        if (candles && candles.length && !isLatestTime(timeString)) {
          candleFileCaches[key] = candles;
        }
      })
    );
  }

  /**
   * 
   * @param pair 
   * @param resolution 
   * @param timeString 
   */
  private fetchCandleStickFile$(pair: string, resolution: string, timeString: string): Observable<CandleStick[]> {
    const url = `${publicUrl}/${pair}/candlestick/${resolution}/${timeString}`;
    return this.bitbank.fetch<BitbankRawCandlesticks>(url).pipe(
      map(raw => raw.data.candlestick[0].ohlcv.map(adaptBitbankCandle))
    )
  }
}
