import { assert } from 'chai';

import { Ticker } from './exchange.type';

export function checkTicker(ticker: Ticker): void {
  assert(ticker);
  assert.typeOf(ticker.bid, 'number');
  assert.typeOf(ticker.ask, 'number');
  assert.typeOf(ticker.low, 'number');
  assert.typeOf(ticker.high, 'number');
  assert.typeOf(ticker.vol, 'number');
}
