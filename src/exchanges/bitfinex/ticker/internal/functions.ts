import { Ticker } from '../../../exchange-types';
import { getSymbol, apiEndpoint } from '../../bitfinex-common';
import { BitfinexRawTicker } from './types';

export function getTickerApiUrl(pair: string): string {
  // https://api.bitfinex.com/v2/ticker/tBTCUSD
  const symbol = getSymbol(pair);
  const url = `${apiEndpoint}/ticker/${symbol}`;

  return url;
}

export function adaptBitfinexTicker(bitfinexTicker: BitfinexRawTicker, pair: string): Ticker {
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
