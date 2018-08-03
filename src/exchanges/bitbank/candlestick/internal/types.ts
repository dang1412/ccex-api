export type BitbankRawCandle = [
  string, // open
  string, // high
  string, // low
  string, // close
  string, // volume
  number // timestamp
];

export interface BitbankRawCandlesticks {
  candlestick: {
    type: string;
    ohlcv: BitbankRawCandle[];
  }[];
}
