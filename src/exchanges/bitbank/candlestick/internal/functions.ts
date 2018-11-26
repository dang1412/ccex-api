import { CandleStick } from '../../../exchange-types';
import { BitbankRawCandle } from './types';

/**
 * @param bitbankCandle
 */
export function adaptBitbankCandle(bitbankCandle: BitbankRawCandle): CandleStick {
  return {
    open: +bitbankCandle[0],
    high: +bitbankCandle[1],
    low: +bitbankCandle[2],
    close: +bitbankCandle[3],
    volume: +bitbankCandle[4],
    timestamp: bitbankCandle[5],
  };
}

export function eliminateRedundantCandles(candles: CandleStick[], start: number, end?: number): CandleStick[] {
  candles = candles || [];

  let index = candles.findIndex((candle) => candle.timestamp >= start);
  // not found
  index = index === -1 ? 0 : index;

  let rearIndex = (end ? candles.findIndex((candle) => candle.timestamp > end) : candles.length) + 1;
  // not found
  rearIndex = rearIndex || candles.length;

  return candles.slice(index, rearIndex);
}

/**
 * @param timestamp
 * @param resolution
 */
export function convertTimestampToCandleFoot(timestamp: number, minutesFoot: number): number {
  return timestamp - (timestamp % (minutesFoot * 60 * 1000));
}

export function isLatestTimestring(timestring: string): boolean {
  const date = new Date();
  const latestYear = date.getUTCFullYear() + '';
  const latestDay = getUTCDateString(date.getTime());

  return timestring === latestYear || timestring === latestDay;
}

export function getTimestringArrayFromRange(resolution: string, start: number, end: number): string[] {
  // each resolution is stored in a file of 1 day or 1 year,
  // this indicates resolutions that stored in 1 day file (1hour or lower)
  const resolutionUseDay: {[key: string]: boolean} = {
    '1min': true,
    '5min': true,
    '15min': true,
    '30min': true,
    '1hour': true,
  };
  const useDay = resolutionUseDay[resolution];
  const timestringArray = useDay ? getDateTimestringArrayFromRange(start, end) : getYearTimestringArrayFromRange(start, end);

  return timestringArray;
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

function getDateTimestringArrayFromRange(start: number, end: number): string[] {
  let dateString = getUTCDateString(start);
  const endDateString = getUTCDateString(end);

  const timestringArray = [];

  // loop condition: dateFormat <= endDateFormat;
  while (dateString <= endDateString) {
    timestringArray.push(dateString);
    dateString = nextDateString(dateString);
  }

  return timestringArray;
}

function getYearTimestringArrayFromRange(start: number, end: number): string[] {
  let year = getUTCYearString(start);
  const endYear = getUTCYearString(end);

  const timestringArray = [];

  // loop condition: dateFormat <= endDateFormat;
  while (year <= endYear) {
    timestringArray.push(year + '');
    year += 1;
  }

  return timestringArray;
}

export function nextDateString(dateString: string): string {
  const dayStr = dateString.substr(6, 2);
  const date = new Date(`${dateString.substr(0, 4)}-${dateString.substr(4, 2)}-${dayStr}`);
  const nextDay = +dayStr + 1;
  return getUTCDateString(date.setUTCDate(nextDay));
}

function getUTCYearString(ts: number): number {
  const d = new Date(ts);
  return d.getUTCFullYear();
}
