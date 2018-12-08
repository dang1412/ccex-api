import { Ticker } from '../../../exchange-types';
import { BitbankRawTicker } from './types';

export function adaptBitbankTicker(bitbankTicker: BitbankRawTicker, pair: string): Ticker {
  return {
    pair,
    ask: +bitbankTicker.sell,
    bid: +bitbankTicker.buy,
    low: +bitbankTicker.low,
    high: +bitbankTicker.high,
    last: +bitbankTicker.last,
    vol: +bitbankTicker.vol,
    timestamp: bitbankTicker.timestamp,
  };
}
