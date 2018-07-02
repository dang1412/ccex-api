import { CandleStick } from '../../../exchange-types';
import { apiEndPoint, wsEndpoint, binancePair } from '../../binance-common';
import { BinanceRawRestCandle, BinanceRawWsCandle } from './types';

// candlestick rest api url
export function binanceCandleStickApiUrl(pair: string, minutesFoot: number, startTime?: number, endTime?: number, limit?: number): string {
  const symbol = binancePair(pair).toUpperCase();
  const interval = getCandleInterval(minutesFoot);
  let url = apiEndPoint + `/api/v1/klines?symbol=${symbol}&interval=${interval}`;

  if (startTime) {
    url += `&startTime=${startTime}`;
  }
  if (endTime) {
    url += `&endTime=${endTime}`;
  }
  if (limit) {
    url += `&limit=${limit}`;
  }

  return url;
}

// candlestick ws channel
export function binanceCandleStickChannel(pair: string, minutesFoot: number): string {
  const interval = getCandleInterval(minutesFoot);
  return wsEndpoint + binancePair(pair) + '@kline_' + interval;
}

export function adaptBinanceRestCandle(binanceCandle: BinanceRawRestCandle): CandleStick {
  return {
    open: +binanceCandle[1],
    high: +binanceCandle[2],
    low: +binanceCandle[3],
    close: +binanceCandle[4],
    volume: +binanceCandle[5],
    timestamp: binanceCandle[6],
  }
}

export function adaptBinanceWsCandle(binanceCandle: BinanceRawWsCandle): CandleStick {
  return {
    open: +binanceCandle.k.o,
    high: +binanceCandle.k.h,
    low: +binanceCandle.k.l,
    close: +binanceCandle.k.c,
    volume: +binanceCandle.k.v,
    timestamp: binanceCandle.k.t,
  }
}

const minutesIntervalMap = {
  1: '1m',
  3: '3m',
  5: '5m',
  15: '15m',
  30: '30m',
  60: '1h',
  120: '2h',
  240: '4h',
  360: '6h',
  480: '8h',
  720: '12h',
  1440: '1d',
  4320: '3d',
  10080: '1w',
}

function getCandleInterval(minutesFoot: number): string {
  return minutesIntervalMap[minutesFoot] || '';
}
