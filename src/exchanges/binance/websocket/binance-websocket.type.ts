export interface BinanceWebsocketMessage<T=any> {
  stream: string;
  data: T;
}

// https://github.com/binance-exchange/binance-official-api-docs/blob/master/web-socket-streams.md#subscribe-to-a-stream
// {
//   "method": "SUBSCRIBE",
//   "params": [
//     "btcusdt@aggTrade",
//     "btcusdt@depth"
//   ],
//   "id": 1
// }
export interface BinanceWebscoketRequest {
  method: 'SUBSCRIBE' | 'UNSUBSCRIBE';
  params: string[];
  id: number;
}
