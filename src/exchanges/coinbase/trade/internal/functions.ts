import { Trade } from '../../../exchange-types';
import { getProductId, apiEndpoint } from '../../coinbase-common';
import { CoinbaseRawWsTrade, CoinbaseRawRestTrade } from './types';

// /products/<product-id>/trades
export function getTradesUrl(pair: string): string {
  return `${apiEndpoint}/products/${getProductId(pair)}/trades`;
}

export function adaptCoinbaseRawTrade(coinbaseRawTrade: CoinbaseRawWsTrade | CoinbaseRawRestTrade): Trade {
  return {
    id: coinbaseRawTrade.trade_id,
    side: coinbaseRawTrade.side,
    price: +coinbaseRawTrade.price,
    amount: +coinbaseRawTrade.size,
    timestamp: new Date(coinbaseRawTrade.time || '').getTime(),
  };
}
