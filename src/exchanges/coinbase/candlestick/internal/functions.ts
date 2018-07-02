import { CandleStick } from '../../../exchange-types';
import { getProductId, apiEndpoint } from '../../coinbase-common';
import { CoinbaseRawCandleStick } from './types';

// /products/<product-id>/candles
export function getCandleStickUrl(pair: string, minutesFoot: number, start?: number, end?: number): string {
  const granularity = minutesFoot * 60;
  let url = `${apiEndpoint}/products/${getProductId(pair)}/candles?granularity=${granularity}`;

  if (start) {
    url += `&start=${new Date(start).toISOString()}`;
  }
  if (end) {
    url += `&end=${new Date(end).toISOString()}`;
  }

  return url;
}

export function adaptCoinbaseCandleStick(rawCandle: CoinbaseRawCandleStick): CandleStick {
  return {
    low: rawCandle[1],
    high: rawCandle[2],
    open: rawCandle[3],
    close: rawCandle[4],
    volume: rawCandle[5],
    timestamp: rawCandle[0] * 1000,
  }
}
