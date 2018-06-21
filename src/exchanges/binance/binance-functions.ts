import { Ticker, Orderbook, Trade, CandleStick } from '../exchange-types';
import { BinanceRawWsTicker, BinanceRawRestTicker, BinanceRawWsOrderbook,
  BinanceRawRestTrade, BinanceRawWsTrade, BinanceRawRestCandle, BinanceRawWsCandle } from './binance-types';

const wsEndpoint = 'wss://stream2.binance.com:9443/ws/';
const apiEndPoint = 'https://api.binance.com';

// get binance pair
export function binancePair(pair: string): string {
  return pair.replace('_', '').toLowerCase();
}

// ticker rest api url
export function binanceTickerApiUrl(pair: string): string {
  return apiEndPoint + '/api/v1/ticker/24hr?symbol=' + binancePair(pair).toUpperCase();
}

// ticker ws channel
export function binanceTickerChannel(pair: string): string {
  return wsEndpoint + binancePair(pair) + '@ticker';
}

// adapt rest ticker
export function adaptBinanceRestTicker(binanceTicker: BinanceRawRestTicker, pair: string): Ticker {
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
  };
}

// adapt ws ticker
export function adaptBinanceWsTicker(binanceTicker: BinanceRawWsTicker, pair: string): Ticker {
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
    timestamp: new Date(binanceTicker.E).getTime()
  };
}

// orderbook rest api url
export function binanceOrderbookApiUrl(pair: string, limit = 20): string {
  return apiEndPoint + '/api/v1/depth?limit=' + limit + '&symbol=' + binancePair(pair).toUpperCase();
}

// orderbook ws channel
export function binanceOrderbookChannel(pair: string): string {
  return wsEndpoint + binancePair(pair) + '@depth';
}

// adapt socket orderbook
export function adaptBinanceWsOrderbook(binanceOrderbook: BinanceRawWsOrderbook): Orderbook {
  return {
    bids: binanceOrderbook.b,
    asks: binanceOrderbook.a,
    lastUpdateId: binanceOrderbook.u,
  };
}

// trades rest api url
export function binanceTradeApiUrl(pair: string, limit = 100): string {
  return apiEndPoint + '/api/v1/trades?limit=' + limit + '&symbol=' + binancePair(pair).toUpperCase();
}

// trades ws channel
export function binanceTradeChannel(pair: string): string {
  return wsEndpoint + binancePair(pair) + '@trade';
}

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

export function adaptBinanceRestTrade(binanceTrade: BinanceRawRestTrade): Trade {
  return {
    id: binanceTrade.id,
    price: +binanceTrade.price,
    amount: +binanceTrade.qty,
    side: binanceTrade.isBuyerMaker ? 'buy' : 'sell',
    timestamp: binanceTrade.time
  };
}

export function adaptBinanceWsTrade(binanceTrade: BinanceRawWsTrade): Trade {
  return {
    id: binanceTrade.t,
    price: +binanceTrade.p,
    amount: +binanceTrade.q,
    side: binanceTrade.m ? 'buy' : 'sell',
    timestamp: binanceTrade.T
  };
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
