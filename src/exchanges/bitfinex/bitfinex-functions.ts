import { Ticker } from '../exchange.type';
import { BitfinexTickerI } from './bitfinex-types';

export const wsEndpoint = 'wss://api.bitfinex.com/ws/2';

export function getSymbol(pair: string): string {
  return 't' + pair.replace('_', '').toUpperCase();
}

export function adaptBitfinexTicker(bitfinexTicker: BitfinexTickerI, pair: string): Ticker {
  return {
    pair,
    ask: bitfinexTicker[2],
    bid: bitfinexTicker[0],
    low: bitfinexTicker[9],
    high: bitfinexTicker[8],
    last: bitfinexTicker[6],
    vol: bitfinexTicker[7],
    change24: bitfinexTicker[4],
    change24Perc: bitfinexTicker[5],
    timestamp: new Date().getTime(),
  };
}
