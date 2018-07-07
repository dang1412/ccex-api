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

  // best bid price < best ask price
  assert(+orderbook.bids[0][0] < +orderbook.asks[0][0]);

  // check order bids: DESC, asks: ASC
  assert(
    checkOrder<[string, string]>(orderbook.bids, (prevBid, curBid) => +prevBid[0] > +curBid[0]),
    'bids should have DESC order in price',
  );
  assert(
    checkOrder<[string, string]>(orderbook.asks, (prevAsk, curAsk) => +prevAsk[0] < +curAsk[0]),
    'asks should have ASC order in price',
  );
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

// used to check orderbook bids, asks order
function checkOrder<T>(tArray: T[], check: (prevT: T, curT: T) => boolean): boolean {
  if (!tArray || !tArray.length) {
    return false;
  }

  let prevT = tArray[0];
  for (let i = 1; i < tArray.length; i++) {
    if (!check(prevT, tArray[i])) {
      return false;
    }

    prevT = tArray[i];
  }

  return true;
}
