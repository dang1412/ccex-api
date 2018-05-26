export const publicUrl = 'https://public.bitbank.cc';

export type BitbankCandle = [
  string, // open
  string, // high
  string, // low
  string, // close
  string, // volume
  number  // timestamp
];

export interface BitbankRawCandlesticks {
  success: 0 | 1;
  data: {
    candlestick: {
      type: string;
      ohlcv: BitbankCandle[];
    }[];
  }
}
