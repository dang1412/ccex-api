import { WebsocketMessageResponse } from '../../coinbase-common.types';

// {
//   "type": "match",
//   "trade_id": 10,
//   "sequence": 50,
//   "maker_order_id": "ac928c66-ca53-498f-9c13-a110027a60e8",
//   "taker_order_id": "132fb6ae-456b-4654-b4e0-d681ac05cea1",
//   "time": "2014-11-07T08:19:27.028459Z",
//   "product_id": "BTC-USD",
//   "size": "5.23512",
//   "price": "400.23",
//   "side": "sell"
// }
export interface CoinbaseRawWsTrade extends WebsocketMessageResponse {
  type: 'match';
  trade_id: number;
  sequence: number;
  maker_order_id: string;
  taker_order_id: string;
  size: string;
  price: string;
  // side of maker sell: up, buy: down
  side: 'buy' | 'sell';
}

// "time": "2014-11-07T01:08:43.642366Z",
// "trade_id": 73,
// "price": "100.00000000",
// "size": "0.01000000",
// "side": "sell"
export interface CoinbaseRawRestTrade {
  time: string;
  trade_id: number;
  size: string;
  price: string;
  // side of maker sell: up, buy: down
  side: 'buy' | 'sell';
}
