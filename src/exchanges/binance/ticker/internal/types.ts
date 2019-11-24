export interface BinanceRestTicker {
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

// {
//   "e": "24hrTicker",  // Event type
//   "E": 123456789,     // Event time
//   "s": "BNBBTC",      // Symbol
//   "p": "0.0015",      // Price change
//   "P": "250.00",      // Price change percent
//   "w": "0.0018",      // Weighted average price
//   "x": "0.0009",      // First trade(F)-1 price (first trade before the 24hr rolling window)
//   "c": "0.0025",      // Last price
//   "Q": "10",          // Last quantity
//   "b": "0.0024",      // Best bid price
//   "B": "10",          // Best bid quantity
//   "a": "0.0026",      // Best ask price
//   "A": "100",         // Best ask quantity
//   "o": "0.0010",      // Open price
//   "h": "0.0025",      // High price
//   "l": "0.0010",      // Low price
//   "v": "10000",       // Total traded base asset volume
//   "q": "18",          // Total traded quote asset volume
//   "O": 0,             // Statistics open time
//   "C": 86400000,      // Statistics close time
//   "F": 0,             // First trade ID
//   "L": 18150,         // Last trade Id
//   "n": 18151          // Total number of trades
// }
export interface BinanceWsTicker {
  e: '24hrTicker'; // Event type
  E: number; // Event time
  s: string; // Symbol
  p: string; // Price change
  P: string; // Price change percent
  w: string; // Weighted average price
  x: string; // Previous day's close price
  c: string; // Current day's close price
  Q: string; // Close trade's quantity
  b: string; // Best bid price
  B: string; // Bid bid quantity
  a: string; // Best ask price
  A: string; // Best ask quantity
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
  O: number; // Statistics open time
  C: number; // Statistics close time
  F: number; // First trade ID
  L: number; // Last trade Id
  n: number; // Total number of trades
}

// {
//   "e": "24hrMiniTicker",  // Event type
//   "E": 123456789,         // Event time
//   "s": "BNBBTC",          // Symbol
//   "c": "0.0025",          // Close price
//   "o": "0.0010",          // Open price
//   "h": "0.0025",          // High price
//   "l": "0.0010",          // Low price
//   "v": "10000",           // Total traded base asset volume
//   "q": "18"               // Total traded quote asset volume
// }
export interface BinanceWsMiniTicker {
  e: '24hrMiniTicker';  // Event type
  E: number;  // Event time
  s: string;  // Symbol
  c: string;  // Close price
  o: string;  // Open price
  h: string;  // High price
  l: string;  // Low price
  v: string;  // Total traded base asset volume
  q: string;  // Total traded quote asset volume
}
