import { Trade } from '../../../exchange-types';
import { BitmexTradeWebsocketData } from './types';

// export interface Trade {
//   id: number;
//   side: 'buy' | 'sell';
//   price: number;
//   amount: number;
//   timestamp: number;
// }

export function adaptBitmexTrade(bitmexTrade: BitmexTradeWebsocketData): Trade {
  return {
    id: 1,
    side: bitmexTrade.side === 'Buy' ? 'buy' : 'sell',
    price: bitmexTrade.price,
    amount: +(bitmexTrade.size / bitmexTrade.price).toFixed(2),
    timestamp: new Date(bitmexTrade.timestamp).getTime(),
  }
}
