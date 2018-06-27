import { getSymbol, apiEndpoint } from '../../bitfinex-common';
import { BitfinexRawTrade } from './types';
import { Trade } from '../../../exchange-types';

export function getTradesUrl(pair: string, start: number, end: number, limit: number, sort = -1): string {
  // `${url}/trades/tBTCUSD/hist`,
  const symbol = getSymbol(pair);
  let url = `${apiEndpoint}/trades/${symbol}/hist?sort=${sort}`;

  if (start) {
    url += `&start=${start}`;
  }
  if (end) {
    url += `&end=${end}`;
  }
  if (limit) {
    url += `&limit=${limit}`;
  }

  return url;
}

export function adaptBitfinexTrade(bitfinexTrade: BitfinexRawTrade): Trade {
  return {
    id: bitfinexTrade[0],
    timestamp: bitfinexTrade[1],
    amount: Math.abs(bitfinexTrade[2]),
    price: bitfinexTrade[3],
    side: bitfinexTrade[2] > 0 ? 'buy' : 'sell'
  };
}
