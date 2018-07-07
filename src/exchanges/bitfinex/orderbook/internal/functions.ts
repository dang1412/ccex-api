import { Orderbook } from '../../../exchange-types';
import { BitfinexOrderbookSingleItem } from './types';

// assuming that all bids and asks are in the right order (bids: DESC, asks: ASC)
export function adaptBitfinexOrderbook(bitfinexOrderbook: BitfinexOrderbookSingleItem[]): Orderbook {
  const orderbook: Orderbook = {
    bids: [],
    asks: [],
  };

  bitfinexOrderbook.forEach((orderbookItem) => {
    // if count === 0 set amoumt 0
    const amount = (orderbookItem[1] > 0 ? Math.abs(orderbookItem[2]) : 0) + '';
    const price = orderbookItem[0] + '';
    if (orderbookItem[2] > 0) {
      orderbook.bids.push([price, amount]);
    } else {
      orderbook.asks.push([price, amount]);
    }
  });

  return orderbook;
}

// arrange bids and asks in the right order (bids: DESC, asks: ASC)
export function arrangeBitfinexOrderbookItems(bitfinexOrderbook: BitfinexOrderbookSingleItem[]): BitfinexOrderbookSingleItem[] {
  const bids = bitfinexOrderbook.filter((item) => item[2] > 0).sort((i1, i2) => i2[0] - i1[0]);
  const asks = bitfinexOrderbook.filter((item) => item[2] < 0).sort((i1, i2) => i1[0] - i2[0]);

  return bids.concat(asks);
}
