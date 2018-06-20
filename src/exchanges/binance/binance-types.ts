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

export interface BinanceRawRestTrade {
  id: number;
  price: string;
  qty: string;
  time: number;
  isBuyerMaker: boolean;
  isBestMatch: boolean;
}

export interface BinanceRawWsTrade {
  // Event type
  e: 'trade';
  // Event time
  E: number;
  // Symbol
  s: string;
  // Trade ID
  t: number;
  // Price
  p: string;
  // Quantity
  q: string;
  // Buyer order Id
  b: number;
  // Seller order Id
  a: number;
  // Trade time
  T: number;
  // Is the buyer the market maker?
  m: boolean;
}

// [
//   1499040000000,      // Open time
//   "0.01634790",       // Open
//   "0.80000000",       // High
//   "0.01575800",       // Low
//   "0.01577100",       // Close
//   "148976.11427815",  // Volume
//   1499644799999,      // Close time
//   "2434.19055334",    // Quote asset volume
//   308,                // Number of trades
//   "1756.87402397",    // Taker buy base asset volume
//   "28.46694368",      // Taker buy quote asset volume
//   "17928899.62484339" // Ignore
// ]
export type BinanceRawRestCandle = [
  // Open time
  number,
  // Open price
  string,
  // High
  string,
  // Low
  string,
  // Close
  string,
  // Volume
  string,
  // Close time
  number,
  // Quote asset volume
  string,
  // Number of trades
  number,
  // Taker buy base asset volume
  string,
  // Taker buy quote asset volume
  string,
  // Ignore
  string
];
