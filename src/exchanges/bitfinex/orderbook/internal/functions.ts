import { Orderbook } from '../../../exchange-types';
import { getSymbol, apiEndpoint } from '../../bitfinex-common';
import { BitfinexOrderbookSingleItem } from './types';

export function getOrderbookApiUrl(pair: string, prec: string = 'P0'): string {
  // https://api.bitfinex.com/v:version/book/:Symbol/:Precision
  // https://api.bitfinex.com/v2/book/tBTCUSD/P0
  const symbol = getSymbol(pair);
  const url = `${apiEndpoint}/book/${symbol}/${prec}`;

  return url;
}

// assuming that all bids and asks are in the right order (bids: DESC, asks: ASC)
export function adaptBitfinexOrderbook(bitfinexOrderbook: BitfinexOrderbookSingleItem[]): Orderbook {
  const orderbook: Orderbook = {
    bids: [],
    asks: [],
  };

  bitfinexOrderbook.forEach((orderbookItem) => {
    // if count === 0 set amount 0
    const amount = orderbookItem[1] > 0 ? Math.abs(orderbookItem[2]) : 0;
    const price = orderbookItem[0];
    if (orderbookItem[2] > 0) {
      orderbook.bids.push([`${price}`, `${amount}`]);
    } else {
      orderbook.asks.push([`${price}`, `${amount}`]);
    }
  });

  return orderbook;
}
