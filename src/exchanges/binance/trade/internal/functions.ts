import { Trade } from '../../../exchange-types';
import { apiEndPoint, binancePair, wsEndpoint } from '../../binance-common';
import { BinanceRawRestTrade, BinanceRawWsTrade } from './types';

// trades rest api url
export function binanceTradeApiUrl(pair: string, limit = 100): string {
  return apiEndPoint + '/api/v1/trades?limit=' + limit + '&symbol=' + binancePair(pair).toUpperCase();
}

// trades ws channel
export function binanceTradeChannel(pair: string): string {
  return wsEndpoint + binancePair(pair) + '@trade';
}

export function adaptBinanceRestTrade(binanceTrade: BinanceRawRestTrade): Trade {
  return {
    id: binanceTrade.id,
    price: +binanceTrade.price,
    amount: +binanceTrade.qty,
    side: binanceTrade.isBuyerMaker ? 'buy' : 'sell',
    timestamp: binanceTrade.time
  };
}

export function adaptBinanceWsTrade(binanceTrade: BinanceRawWsTrade): Trade {
  return {
    id: binanceTrade.t,
    price: +binanceTrade.p,
    amount: +binanceTrade.q,
    side: binanceTrade.m ? 'buy' : 'sell',
    timestamp: binanceTrade.T
  };
}
