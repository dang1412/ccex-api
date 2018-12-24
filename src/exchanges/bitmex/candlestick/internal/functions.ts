import { CandleStick } from '../../../exchange-types';
import { getSymbol, apiEndPoint } from '../../bitmex-common';
import { BitmexRestCandlestick } from './types';

// https://www.bitmex.com/api/udf/history?symbol=EOSZ18&resolution=60&from=1544974016&to=1545578876
// resolution = 1, 5, 60, D
export function getCandleStickUrl(pair: string, minutesFoot: number, start: number, end: number): string {
  const symbol = getSymbol(pair);
  const resolution = minutesFoot >= 1440 ? 'D' : minutesFoot;
  const from = start / 1000;
  const to = end / 1000;

  return `${apiEndPoint}/udf/history?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`;
}

export function adaptBitmexCandlestick(candlestickRestData: BitmexRestCandlestick): CandleStick[] {
  return candlestickRestData.t.map((time, i) => ({
    open: candlestickRestData.o[i],
    close: candlestickRestData.c[i],
    high: candlestickRestData.h[i],
    low: candlestickRestData.l[i],
    volume: candlestickRestData.v[i],
    timestamp: time * 1000,
  }));
}
