export interface WebsocketSubOrUnSubRequest {
  channel: string;
  event?: string;

  // (ticker, orderbook)
  symbol?: string;

  // (orderbook)
  // level of price aggregation (P0, P1, P2, P3)
  // default: P0
  prec?: string;

  // (orderbook)
  // Frequency of updates(F0, F1).
  // F0 = realtime / F1=2sec.
  freq?: string;

  // (orderbook)
  len?: string;

  // (candles)
  key?: string;
}

export interface WebsocketRequestResponse {
  event: string;
  channel: string;
  chanId: number;

  // ex: BTCUSD
  pair?: string;

  // (ticker, orderbook)
  symbol?: string;

  // (orderbook)
  // level of price aggregation (P0, P1, P2, P3)
  // default: P0
  prec?: string;

  // (orderbook)
  // Frequency of updates(F0, F1).
  // F0 = realtime / F1=2sec.
  freq?: string;

  // (orderbook)
  len?: string;

  // (candles)
  key?: string;
}

export type WebsocketMessageResponse<T> = [number, T];


/**
 * Ticker type
 */

export type BitfinexRawTicker = [
  number, // bid 8219.2,
  number, // bid size 51.73033331,
  number, // ask 8220,
  number, // ask size 65.62603128,
  number, // daily change -28.6,
  number, // daily change percent -0.0035,
  number, // last price 8219.8,
  number, // volume 32325.84881438,
  number, // high 8278.7,
  number  // low 8073.6
];


/**
 * Orderbook types
 */

export type BitfinexOrderbookSingleItem = [
  // price
  number,
  // count
  number,
  // amount
  // - (> 0): bids
  // - (< 0): asks
  number
];


/**
 * Candlestick
 */

export type BitfinexRawCandleStick = [
  // MTS int millisecond time stamp
  number,
  // OPEN	float	First execution during the time frame
  number,
  // CLOSE	float	Last execution during the time frame
  number,
  // HIGH	float	Highest execution during the time frame
  number,
  // LOW	float	Lowest execution during the timeframe
  number,
  // VOLUME	float	Quantity of symbol traded within the timeframe
  number
];
