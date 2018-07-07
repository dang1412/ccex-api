import { Ticker } from '../../../exchange-types';
import { getProductId, apiEndpoint } from '../../coinbase-common';
import { CoinbaseRawWsTicker, CoinbaseRawRestTicker } from './types';

// /products/<product-id>/ticker
export function getTickerUrl(pair: string): string {
  return `${apiEndpoint}/products/${getProductId(pair)}/ticker`;
}

export function adaptCoinbaseRawWsTicker(coinbaseRawTicker: CoinbaseRawWsTicker, pair: string): Ticker {
  return {
    pair,
    ask: +coinbaseRawTicker.best_ask,
    bid: +coinbaseRawTicker.best_bid,
    low: +coinbaseRawTicker.low_24h,
    high: +coinbaseRawTicker.high_24h,
    last: +coinbaseRawTicker.price,
    vol: +coinbaseRawTicker.volume_24h,
    timestamp: new Date(coinbaseRawTicker.time).getTime(),
  };
}

export function adaptCoinbaseRawRestTicker(coinbaseRawTicker: CoinbaseRawRestTicker, pair: string): Ticker {
  return {
    pair,
    ask: +coinbaseRawTicker.ask,
    bid: +coinbaseRawTicker.bid,
    low: 0,
    high: 0,
    last: +coinbaseRawTicker.price,
    vol: +coinbaseRawTicker.volume,
    timestamp: new Date(coinbaseRawTicker.time).getTime(),
  };
}
