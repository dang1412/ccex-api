export interface ExchangeOptions {
  apiKey?: string;
  apiSecret?: string;
  corsProxy?: string;
}

/*
 * Exchange basic info
 */
export interface ExchangeInfo {
  name: string;
  logoUrl: string;
  homepage: string;
  country: string;
}

/*
 * Ticker
 */
export interface Ticker {
  pair: string;
  ask: number;
  bid: number;
  low: number;
  high: number;
  last: number;
  vol: number;
  timestamp: number;
  change24?: number;
  change24Perc?: number;
  isRequest?: boolean;
}

/*
 * Orderbook
 */
export interface Orderbook {
  asks: [string, string][]; // asc order
  bids: [string, string][]; // des order
  lastUpdateId?: number;
  timestamp?: number;
}

export interface Trade {
  id: number;
  side: 'buy' | 'sell';
  price: number;
  amount: number;
  timestamp: number;
}

/*
 * CandleStick
 */
export interface CandleStick {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
  type?: number; // number in minute ex. 1 (1 minute), 60 (1hour)
}

export interface SupportFeatures {
  ticker: boolean;
  orderbook: boolean;
  chart: boolean;
}

// export type TradingViewResolution = '1' | '5' | '15' | '30' | '60' | '240' | '480' | '720' | 'D' | 'W' | 'M';

// export interface TradingViewBar {
//   open: number;
//   high: number;
//   low: number;
//   close: number;
//   volume: number;
//   time: number;
//   originalTime: number; // tradingView auto adjust time property so it is safe to store originalTime
// }
