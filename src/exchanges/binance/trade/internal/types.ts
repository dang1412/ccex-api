export interface BinanceRestTrade {
  id: number;
  price: string;
  qty: string;
  time: number;
  isBuyerMaker: boolean;
  isBestMatch: boolean;
}

export interface BinanceWsTrade {
  e: 'trade'; // Event type
  E: number;  // Event time
  s: string;  // Symbol
  t: number;  // Trade ID
  p: string;  // Price
  q: string;  // Quantity
  b: number;  // Buyer order ID
  a: number;  // Seller order ID
  T: number;  // Trade time
  m: boolean; // Is the buyer the market maker?
}

// {
//   "e": "aggTrade",  // Event type
//   "E": 123456789,   // Event time
//   "s": "BNBBTC",    // Symbol
//   "a": 12345,       // Aggregate trade ID
//   "p": "0.001",     // Price
//   "q": "100",       // Quantity
//   "f": 100,         // First trade ID
//   "l": 105,         // Last trade ID
//   "T": 123456785,   // Trade time
//   "m": true,        // Is the buyer the market maker?
//   "M": true         // Ignore
// }
export interface BinanceWsAggTrade {
  e: 'aggTrade'; // Event type
  E: number;  // Event time
  s: string;  // Symbol
  t: number;  // Trade ID
  p: string;  // Price
  q: string;  // Quantity
  f: number;  // First trade ID
  l: number;  // Last trade ID
  T: number;  // Trade time
  m: boolean; // Is the buyer the market maker?
}
