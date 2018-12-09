import { Orderbook } from '../../../exchange-types';
import { getProductId, apiEndpoint } from '../../coinbase-common';
import { CoinbaseWsOrderbookSnapshot, CoinbaseWsOrderbookUpdate, CoinbaseRestOrderbook } from './types';

// /products/BTC-USD/book?level=2
export function getOrderbookUrl(pair: string): string {
  return `${apiEndpoint}/products/${getProductId(pair)}/book?level=2`;
}

export function adaptCoinbaseRestOrderbook(restOrderbook: CoinbaseRestOrderbook): Orderbook {
  return {
    bids: restOrderbook.bids.map((restBid) => <[string, string]>restBid.slice(0, 2)),
    asks: restOrderbook.asks.map((restAsk) => <[string, string]>restAsk.slice(0, 2)),
  };
}

export function adaptCoinbaseWsOrderbookSnapshot(snapshot: CoinbaseWsOrderbookSnapshot): Orderbook {
  return {
    bids: snapshot.bids.slice(0, 50),
    asks: snapshot.asks.slice(0, 50),
  };
}

export function adaptCoinbaseWsOrderbookUpdate(update: CoinbaseWsOrderbookUpdate): Orderbook {
  const orderbook: Orderbook = { bids: [], asks: [] };
  update.changes.forEach((change) => {
    const orderbookItem: [string, string] = [change[1], change[2]];
    if (change[0] === 'buy') {
      orderbook.bids.push(orderbookItem);
    } else if (change[0] === 'sell') {
      orderbook.asks.push(orderbookItem);
    }
  });

  return orderbook;
}
