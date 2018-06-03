import { Ticker } from '../exchange-types';
import { CoincheckRawTicker } from './coincheck-types';

export const publicUrl = 'https://coincheck.com';

export function adaptCoincheckRawTicker(coincheckRawTicker: CoincheckRawTicker, pair: string): Ticker {
  return {
    pair,
    ask: coincheckRawTicker.ask,
    bid: coincheckRawTicker.bid,
    low: coincheckRawTicker.low,
    high: coincheckRawTicker.high,
    last: coincheckRawTicker.last,
    vol: coincheckRawTicker.volume,
    timestamp: coincheckRawTicker.timestamp
  };
}
