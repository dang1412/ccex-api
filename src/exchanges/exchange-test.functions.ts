import { assert } from 'chai';

import { Ticker } from './exchange.type';

export function checkTicker(ticker: Ticker): boolean {
  assert.typeOf(ticker.buy, 'number');
  assert.typeOf(ticker.sell, 'number');
  assert.typeOf(ticker.low, 'number');
  assert.typeOf(ticker.high, 'number');
  assert.typeOf(ticker.vol, 'number');

  return true;
}
