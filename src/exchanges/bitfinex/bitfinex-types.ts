export interface WebsocketSubscribeRequest {
  event: string;
  channel: string;
  // when subscribe ticker, orderbook
  symbol?: string;
  // when subscribe candles
  key?: string;
}

export interface WebsocketSubscribeResponse {
  event: string;
  channel: string;
  chanId: number;
  // when subscribe ticker, orderbook
  symbol?: string;
  // when subscribe candles
  key?: string;
}

export type WebsocketMessageResponse<T> = [number, T];

export type BitfinexTickerI = [
  number, // bid 8219.2,
  number, // bid size 51.73033331,
  number, // ask 8220,
  number, // ask size 65.62603128,
  number, // daily change -28.6,
  number, // daily change percent -0.0035,
  number, // last price 8219.8,
  number, // volume 32325.84881438,
  number, // high 8278.7,
  number  // low 8073.6
];
