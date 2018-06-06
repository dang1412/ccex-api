export interface RawData<T> {
  success: 0 | 1;
  data: T;
}

export interface BitbankRawTicker {
  pair: string;
  sell: string;
  buy: string;
  low: string;
  high: string;
  last: string;
  vol: string;
  timestamp: number;
}

export interface BitbankRawOrderbook {
  asks: [string, string][];
  bids: [string, string][];
  timestamp: number;
}

export type BitbankRawCandle = [
  string, // open
  string, // high
  string, // low
  string, // close
  string, // volume
  number  // timestamp
];

export interface BitbankRawCandlesticks {
  candlestick: {
    type: string;
    ohlcv: BitbankRawCandle[];
  }[];
}
