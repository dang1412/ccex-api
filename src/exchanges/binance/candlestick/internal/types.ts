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

export interface BinanceRawWsCandle {
  e: 'kline';
  // Event time
  E: number;
  // Symbol
  s: string;
  k: {
    // Kline start time
    t: number;
    // Kline close time
    T: number;
    // Symbol
    s: string;
    // Interval
    i: string;
    // First trade ID
    f: number;
    // Last trade ID
    L: number;
    // Open price
    o: string;
    // Close price
    c: string;
    // High price
    h: string;
    // Low price
    l: string;
    // Base asset volume
    v: string;
    // Number of trades
    n: number;
    // Is this kline closed?
    x: boolean;
    // Quote asset volume
    q: string;
    // Taker buy base asset volume
    V: string;
    // Taker buy quote asset volume
    Q: string;
    // Ignore
    B: string;
  }
}
