export interface BinanceRawOrderbook {
  bids: [string, string][];
  asks: [string, string][];
  lastUpdateId: number;
}

export interface BinanceRawWsOrderbook {
  // event type 'depthUpdate'
  e: string;
  // event time
  E: number;
  // symbol 'BNBBTC'
  s: string;
  // first update id
  U: number;
  // last update id
  u: number;
  // bids
  b: [string, string][];
  // asks
  a: [string, string][];
}
