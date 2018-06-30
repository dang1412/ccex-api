import { assert } from 'chai';

import { Ticker, Orderbook, Trade } from './exchange-types';

export function checkTicker(ticker: Ticker): void {
  assert(ticker);
  assert(ticker.bid);
  assert(ticker.ask);
  // assert(ticker.low);
  // assert(ticker.high);
  assert(ticker.vol);
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
  assert(orderbook.asks[0].length >= 2);
  assert(orderbook.bids[0].length >= 2);
}

export function checkTrades(trades: Trade[], increaseTimestamp = true): void {
  assert(trades);
  assert(trades.length >= 0);

  let lastTradeTime = 0;
  trades.forEach((trade) => {
    assert(trade.id);
    assert(trade.price);
    assert(trade.amount >= 0);
    assert(trade.side);
    assert(trade.timestamp);

    if (increaseTimestamp) {
      // trade array must be in increase timestamp order
      assert(trade.timestamp >= lastTradeTime, 'should have increase timestamp order');
    }

    // update last timestamp
    lastTradeTime = trade.timestamp;
  });
}
