import { WebsocketMessageResponse } from '../../coinbase-common.types';

// {
//   "sequence": "3",
//   "bids": [
//     [price, size, num - orders],
//     ["295.96", "4.39088265", 2],
//     ...
//   ],
//   "asks": [
//     [price, size, num - orders],
//     ["295.97", "25.23542881", 12],
//     ...
//   ]
// }
export interface CoinbaseRestOrderbook {
  sequence: string;
  // [price, size, num - orders]
  bids: [string, string, number][];
  asks: [string, string, number][];
}

// {
//   "type": "snapshot",
//   "product_id": "BTC-EUR",
//   "bids": [["6500.11", "0.45054140"]],
//   "asks": [["6500.15", "0.57753524"]]
// }
export interface CoinbaseWsOrderbookSnapshot extends WebsocketMessageResponse {
  type: 'snapshot';
  bids: [string, string][];
  asks: [string, string][];
}

// {
//   "type": "l2update",
//   "product_id": "BTC-EUR",
//   "changes": [
//     ["buy", "6500.09", "0.84702376"],
//     ["sell", "6507.00", "1.88933140"],
//     ["sell", "6505.54", "1.12386524"],
//     ["sell", "6504.38", "0"]
//   ]
// }
export interface CoinbaseWsOrderbookUpdate extends WebsocketMessageResponse {
  type: 'l2update';
  changes: ['buy' | 'sell', string, string][];
}

// export interface CoinbaseRawRestTicker {
//   trade_id: number;
//   price: string;
//   size: string;
//   bid: string;
//   ask: string;
//   volume: string;
//   time: string;
// }
