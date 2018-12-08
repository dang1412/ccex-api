import { Ticker, Orderbook, Trade, CandleStick } from './exchange-types';

// check ticker
export function checkTicker(ticker: Ticker): void {
  expect(ticker);
  expect(ticker.bid);
  expect(ticker.ask);
  // expect(ticker.low);
  // expect(ticker.high);
  expect(ticker.vol);
  expect(typeof ticker.bid).toBe('number');
  expect(typeof ticker.ask).toBe('number');
  expect(typeof ticker.low).toBe('number');
  expect(typeof ticker.high).toBe('number');
  expect(typeof ticker.vol).toBe('number');
}

// check orderbook
export function checkOrderbook(orderbook: Orderbook): void {
  expect(orderbook);
  expect(orderbook.asks);
  expect(orderbook.bids);
  expect(orderbook.asks.length);
  expect(orderbook.bids.length);
  expect(orderbook.asks[0].length >= 2);
  expect(orderbook.bids[0].length >= 2);

  // best bid price < best ask price
  expect(+orderbook.bids[0][0] < +orderbook.asks[0][0]);

  // check order bids: DESC, asks: ASC
  expect(
    checkOrder<[string, string]>(orderbook.bids, (prevBid, curBid) => +prevBid[0] > +curBid[0]),
    // 'bids should have price in DESC order',
  );
  expect(
    checkOrder<[string, string]>(orderbook.asks, (prevAsk, curAsk) => +prevAsk[0] < +curAsk[0]),
    // 'asks should have price in ASC order',
  );
}

// check trades
export function checkTrades(trades: Trade[], increaseTimestamp: boolean = true): void {
  expect(trades);
  expect(trades.length >= 0);

  let lastTradeTime = 0;
  trades.forEach((trade) => {
    expect(trade.id);
    expect(trade.price);
    expect(trade.amount >= 0);
    expect(trade.side);
    expect(trade.timestamp);

    if (increaseTimestamp) {
      // trade array must be in increase timestamp order
      // expect(trade.timestamp >= lastTradeTime, 'should have increase timestamp order');
      expect(trade.timestamp >= lastTradeTime);
    }

    // update last timestamp
    lastTradeTime = trade.timestamp;
  });
}

// check candlestick
export function checkCandleStick(candle: CandleStick): void {
  expect(candle);
  expect(candle.open);
  expect(candle.high);
  expect(candle.low);
  expect(candle.close);
  // assert(candle.volume);
  expect(typeof candle.open).toBe('number');
  expect(typeof candle.high).toBe('number');
  expect(typeof candle.low).toBe('number');
  expect(typeof candle.close).toBe('number');
  expect(typeof candle.volume).toBe('number');
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
