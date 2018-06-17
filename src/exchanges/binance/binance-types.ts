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

export interface BinanceRawRestTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export interface BinanceRawWsTicker {
  'e': string;      // Event type
  'E': number;      // Event time
  's': string;      // Symbol
  'p': string;      // Price change
  'P': string;      // Price change percent
  'w': string;      // Weighted average price
  'x': string;      // Previous day's close price
  'c': string;      // Current day's close price
  'Q': string;      // Close trade's quantity
  'b': string;      // Best bid price
  'B': string;      // Bid bid quantity
  'a': string;      // Best ask price
  'A': string;      // Best ask quantity
  'o': string;      // Open price
  'h': string;      // High price
  'l': string;      // Low price
  'v': string;      // Total traded base asset volume
  'q': string;      // Total traded quote asset volume
  'O': number;      // Statistics open time
  'C': number;      // Statistics close time
  'F': number;      // First trade ID
  'L': number;      // Last trade Id
  'n': number;      // Total number of trades
}
