import { Ticker } from '../exchange.type';
import { BinanceTickerI } from './binance-types';

const wsEndpoint = 'wss://stream2.binance.com:9443/ws/';

export function binancePair(pair: string): string {
  return pair.replace('_', '').toLowerCase();
}

export function binanceTickerChannel(pair: string): string {
  return wsEndpoint + binancePair(pair) + '@ticker';
}

export function adaptBinanceTicker(binanceTicker: BinanceTickerI, pair: string): Ticker {
  return {
    pair,
    sell: +binanceTicker.a,
    buy: +binanceTicker.b,
    low: +binanceTicker.l,
    high: +binanceTicker.h,
    last: +binanceTicker.c,
    vol: +binanceTicker.v,
    change24: +binanceTicker.p,
    change24Perc: +binanceTicker.P / 100,
    timestamp: new Date(binanceTicker.E).getTime()
  };
}
