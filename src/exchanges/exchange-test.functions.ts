import { assert } from 'chai';

import { Ticker, Orderbook } from './exchange.type';

export function checkTicker(ticker: Ticker): void {
  assert(ticker);
  assert.typeOf(ticker.bid, 'number');
  assert.typeOf(ticker.ask, 'number');
  assert.typeOf(ticker.low, 'number');
  assert.typeOf(ticker.high, 'number');
  assert.typeOf(ticker.vol, 'number');
}

export function checkOrderbook(orderbook: Orderbook): void {
  assert(orderbook);
  assert(orderbook.asks);
  assert(orderbook.bids);
  assert(orderbook.asks.length);
  assert(orderbook.bids.length);
  assert(orderbook.asks[0].length === 2);
  assert(orderbook.bids[0].length === 2);
}
