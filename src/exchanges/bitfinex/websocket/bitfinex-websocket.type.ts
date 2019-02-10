export interface WebsocketRequestBaseI {
  channel: string;

  // ex: tBTCUSD (ticker, orderbook)
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

export interface WebsocketSubscribeI extends WebsocketRequestBaseI {
  event: 'subscribe';
}

export interface WebsocketUnSubscribeI {
  event: 'unsubscribe';
  chanId: number;
}

export interface WebsocketResponseI extends WebsocketRequestBaseI {
  event: 'subscribed' | 'unsubscribed';
  chanId: number;
  // ex: BTCUSD
  pair?: string;
}

export type WebsocketDataI = [number, any] | [number, string, any];

export type WebsocketMessageI = WebsocketResponseI | WebsocketDataI;

/**
 * Ticker type
 */

export type BitfinexRawTickerI = [
  number, // bid 8219.2,
  number, // bid size 51.73033331,
  number, // ask 8220,
  number, // ask size 65.62603128,
  number, // daily change -28.6,
  number, // daily change percent -0.0035,
  number, // last price 8219.8,
  number, // volume 32325.84881438,
  number, // high 8278.7,
  number // low 8073.6
];
