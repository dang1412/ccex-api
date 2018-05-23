import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

// import { PubnubRxJs } from '../../common/pubnub-rxjs';
import { CandleStick } from '../exchange.type';
import { Bitbank } from './bitbank';
import { publicUrl } from './bitbank-common';

// const CANDLES_CACHE: { [key: string]: CandleStick[] } = {};

const minutesToResolution = {
  1: '1min',
  5: '5min',
  15: '15min',
  30: '30min',
  60: '1hour',
  240: '4hour',
  1440: '1day',
};

// each resolution is stored in a file of 1 day or 1 year,
// this indicates resolutions that stored in 1 day file (1hour or lower)
const resolutionUseDay = {
  '1min': true,
  '5min': true,
  '15min': true,
  '30min': true,
  '1hour': true,
};

type BitbankCandle = [
  string, // open
  string, // high
  string, // low
  string, // close
  string, // volume
  number  // timestamp
];

interface BitbankRawCandlesticks {
  success: 0 | 1;
  data: {
    candlestick: {
      type: string;
      ohlcv: BitbankCandle[];
    }[];
  }
}

export class BitbankCandlestick {
  private bitbank: Bitbank;
  constructor(bitbank: Bitbank) {
    this.bitbank = bitbank;
  }

  fetchCandleStickRange$(pair: string, minutesFoot: number, start: number, end: number): Observable<CandleStick[]> {
    const resolution = minutesToResolution[minutesFoot] || '1hour';
    const timestrArray = getTimeStrArrayFromRange(resolution, start, end);

    const requestArray = timestrArray.map(timestr => this.fetchCandleStickFile$(pair, resolution, timestr));
    return forkJoin(...requestArray).pipe(
      map(results => Array.prototype.concat.apply([], results))
    );
  }

  private fetchCandleStickFile$(pair: string, resolution: string, timeString: string): Observable<CandleStick[]> {
    const url = `${publicUrl}/${pair}/candlestick/${resolution}/${timeString}`;
    return this.bitbank.fetch<BitbankRawCandlesticks>(url).pipe(
      map(raw => raw.data.candlestick[0].ohlcv.map(adaptBitbankCandle))
    )
  }
}

function getTimeStrArrayFromRange(resolution: string, start: number, end: number): string[] {
  const useDay = resolutionUseDay[resolution];
  return useDay ? getDayTimeStringArrayFromRange(start, end) : getYearTimeStringArrayFromRange(start, end);
}

/**
 * 
 * @param ts timestamp
 * @result YYYYMMDD
 */
function getUTCDateString(ts: number): string {
  const d = new Date(ts);
  const yearStr = d.getUTCFullYear() + '';

  const month = d.getUTCMonth() + 1;
  const monthStr = (month < 10 ? '0' : '') + month;

  const day = d.getUTCDate();
  const dayStr = (day < 10 ? '0' : '') + day;

  return yearStr + monthStr + dayStr;
}

function nextDateString(dateString: string): string {
  const dayStr = dateString.substr(6, 8);
  const date = new Date(`${dateString.substr(0, 4)}-${dateString.substr(4, 6)}-${dayStr} 00:00:00`);
  const nextDay = +dayStr + 1;
  return getUTCDateString(date.setUTCDate(nextDay));
}

function getUTCYearString(ts: number): number {
  const d = new Date(ts);
  return d.getUTCFullYear();
}

function getDayTimeStringArrayFromRange(start: number, end: number): string[] {
  let dateString = getUTCDateString(start);
  const endDateString = getUTCDateString(end);

  const timeStringArray = [];

  // loop condition: dateFormat <= endDateFormat;
  while (dateString <= endDateString) {
    timeStringArray.push(dateString);
    dateString = nextDateString(dateString);
  }

  return timeStringArray;
}

function getYearTimeStringArrayFromRange(start: number, end: number): string[] {
  let year = getUTCYearString(start);
  const endYear = getUTCYearString(end);

  const timeStringArray = [];

  // loop condition: dateFormat <= endDateFormat;
  while (year <= endYear) {
    timeStringArray.push(year + '');
    year += 1;
  }

  return timeStringArray;
}

/**
 * @param bitbankCandle 
 */
function adaptBitbankCandle(bitbankCandle: BitbankCandle): CandleStick {
  return {
    open: +bitbankCandle[0],
    high: +bitbankCandle[1],
    low: +bitbankCandle[2],
    close: +bitbankCandle[3],
    volume: +bitbankCandle[4],
    timestamp: bitbankCandle[5],
  };
}
