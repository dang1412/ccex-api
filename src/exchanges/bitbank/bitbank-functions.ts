import { CandleStick } from '../exchange-types';
import { BitbankCandle } from './bitbank-types';

/**
 * @param bitbankCandle 
 */
export function adaptBitbankCandle(bitbankCandle: BitbankCandle): CandleStick {
  return {
    open: +bitbankCandle[0],
    high: +bitbankCandle[1],
    low: +bitbankCandle[2],
    close: +bitbankCandle[3],
    volume: +bitbankCandle[4],
    timestamp: bitbankCandle[5],
  };
}

/**
 * @param timestamp 
 * @param resolution 
 */
export function convertTimestampToCandleFoot(timestamp: number, minutesFoot: number): number {
  return timestamp - timestamp % (minutesFoot * 60 * 1000);
}

export function isLatestTime(timeString: string): boolean {
  const date = new Date();
  const latestYear = date.getUTCFullYear() + '';
  const latestDay = getUTCDateString(date.getTime());

  return timeString === latestYear || timeString === latestDay;
}

export function getTimeStrArrayFromRange(resolution: string, start: number, end: number): string[] {
  // each resolution is stored in a file of 1 day or 1 year,
  // this indicates resolutions that stored in 1 day file (1hour or lower)
  const resolutionUseDay = {
    '1min': true,
    '5min': true,
    '15min': true,
    '30min': true,
    '1hour': true,
  };
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
