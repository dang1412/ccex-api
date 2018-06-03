import { Ticker } from '../exchange-types';
import { CoinbaseRawTicker } from './coinbase-types';

export const wsEndpoint = 'wss://ws-feed.gdax.com';

export function adaptCoinbaseRawTicker(coinbaseRawTicker: CoinbaseRawTicker, pair: string): Ticker {
  return {
    pair,
    ask: +coinbaseRawTicker.best_ask,
    bid: +coinbaseRawTicker.best_bid,
    low: +coinbaseRawTicker.low_24h,
    high: +coinbaseRawTicker.high_24h,
    last: +coinbaseRawTicker.price,
    vol: +coinbaseRawTicker.volume_24h,
    timestamp: new Date(coinbaseRawTicker.time).getTime()
  };
}

// btc_usd => BTC-USD
export function getProductId(pair: string): string {
  return pair.replace('_', '-').toUpperCase();
}
