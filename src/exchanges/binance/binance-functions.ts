import { Ticker, Orderbook, Trade } from '../exchange-types';
import { BinanceRawWsTicker, BinanceRawRestTicker, BinanceRawWsOrderbook, BinanceRawRestTrade, BinanceRawWsTrade } from './binance-types';

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
