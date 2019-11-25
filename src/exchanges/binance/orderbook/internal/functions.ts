import { Orderbook } from '../../../exchange-types';
import { apiEndPoint, binancePair } from '../../binance-common';
import { BinanceWsUpdateOrderbook } from './types';

// orderbook rest api url
export function binanceOrderbookApiUrl(pair: string, limit: number = 20): string {
  const symbol = binancePair(pair).toUpperCase();

  return `${apiEndPoint}/api/v1/depth?limit=${limit}&symbol=${symbol}`;
}

// orderbook ws channel
export function getOrderbookChannel(pair: string): string {
  return `${binancePair(pair)}@depth`;
}

// adapt socket orderbook
export function adaptBinanceWsOrderbook(binanceOrderbook: BinanceWsUpdateOrderbook): Orderbook {
  return {
    bids: binanceOrderbook.b,
    asks: binanceOrderbook.a,
    lastUpdateId: binanceOrderbook.u,
  };
}
