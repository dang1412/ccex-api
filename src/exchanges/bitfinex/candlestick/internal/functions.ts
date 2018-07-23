import { CandleStick } from '../../../exchange-types';
import { getSymbol, apiEndpoint } from '../../bitfinex-common';
import { BitfinexRawCandleStick } from './types';

export function getCandleStickUrl(pair: string, minutesFoot: number, start?: number, end?: number, limit?: number, sort = -1): string {
  // https://api.bitfinex.com/v2/candles/trade::TimeFrame::Symbol/Section
  // `${url}/candles/trade:1m:tBTCUSD/hist`,
  const symbol = getSymbol(pair);
  const timeFrame = getCandleTimeFrame(minutesFoot);
  let url = `${apiEndpoint}/candles/trade:${timeFrame}:${symbol}/hist?sort=${sort}`;

  // if 'start' provided and no 'limit', calculate to use 'limit' and drop 'start'
  if (start && end && !limit) {
    limit = Math.min(Math.round((end - start) / (minutesFoot * 60 * 1000)) + 1, 1000);
    start = 0;
  }

  if (start) {
    url += `&start=${start}`;
  }
  if (end) {
    url += `&end=${end}`;
  }
  if (limit) {
    url += `&limit=${limit}`;
  }

  return url;
}

// [
//   MTS,
//   OPEN,
//   CLOSE,
//   HIGH,
//   LOW,
//   VOLUME
// ]
export function adaptBitfinexRawCandleStick(bitfinexCandle: BitfinexRawCandleStick): CandleStick {
  return {
    open: +bitfinexCandle[1],
    close: +bitfinexCandle[2],
    high: +bitfinexCandle[3],
    low: +bitfinexCandle[4],
    volume: +bitfinexCandle[5],
    timestamp: bitfinexCandle[0],
  };
}

// '1m', '5m', '15m', '30m', '1h', '3h', '6h', '12h', '1D', '7D', '14D', '1M'
const minutesTimeFrameMap = {
  1: '1m',
  5: '5m',
  15: '15m',
  30: '30m',
  60: '1h',
  180: '3h',
  360: '6h',
  720: '12h',
  1440: '1D',
  10080: '7D',
  20160: '14D',
};

export function getCandleTimeFrame(minutesFoot: number): string {
  return minutesTimeFrameMap[minutesFoot] || '';
}
