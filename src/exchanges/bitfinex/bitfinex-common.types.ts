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
