import { Trade } from '../../../exchange-types';
import { BitmexTradeWebsocketData } from './types';

export function adaptBitmexTrade(bitmexTrade: BitmexTradeWebsocketData): Trade {
  return {
    id: 1,
    side: bitmexTrade.side === 'Buy' ? 'buy' : 'sell',
    price: bitmexTrade.price,
    amount: bitmexTrade.size,
    timestamp: new Date(bitmexTrade.timestamp).getTime(),
  };
}
