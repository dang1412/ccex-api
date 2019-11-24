import { Ticker } from '../../../exchange-types';
import { wsEndpoint, apiEndPoint, binancePair } from '../../binance-common';
import { BinanceRestTicker, BinanceWsTicker } from './types';

// ticker rest api url
export function binanceTickerApiUrl(pair: string): string {
  const symbol = binancePair(pair).toUpperCase();

  return `${apiEndPoint}/api/v1/ticker/24hr?symbol=${symbol}`;
}

// ticker ws channel
export function getTickerChannel(pair: string): string {
  return `${binancePair(pair)}@ticker`;
}

// adapt rest ticker
export function adaptBinanceRestTicker(binanceTicker: BinanceRestTicker, pair: string): Ticker {
  return {
    pair,
    ask: +binanceTicker.askPrice,
    bid: +binanceTicker.bidPrice,
    low: +binanceTicker.lowPrice,
    high: +binanceTicker.highPrice,
    last: +binanceTicker.lastPrice,
    vol: +binanceTicker.volume,
    change24: +binanceTicker.priceChange,
    change24Perc: +binanceTicker.priceChangePercent / 100,
    timestamp: +binanceTicker.closeTime,
    open: +binanceTicker.openPrice,
    prevClose: +binanceTicker.prevClosePrice,
  };
}

// adapt ws ticker
export function adaptBinanceWsTicker(binanceTicker: BinanceWsTicker, pair: string): Ticker {
  return {
    pair,
    ask: +binanceTicker.a,
    bid: +binanceTicker.b,
    low: +binanceTicker.l,
    high: +binanceTicker.h,
    last: +binanceTicker.c,
    vol: +binanceTicker.v,
    change24: +binanceTicker.p,
    change24Perc: +binanceTicker.P / 100,
    timestamp: new Date(binanceTicker.E).getTime(),
    open: +binanceTicker.o,
    prevClose: +binanceTicker.x,
  };
}
