import { WebsocketSubOrUnSubRequest, WebsocketRequestResponse } from './bitfinex-common.types';

export const wsEndpoint = 'wss://api.bitfinex.com/ws/2';
export const apiEndpoint = 'https://api.bitfinex.com/v2';

export function getSymbol(pair: string): string {
  return `t${pair.replace('_', '').toUpperCase()}`;
}

export function getKey(subscribeObject: WebsocketSubOrUnSubRequest | WebsocketRequestResponse): string {
  return (
    subscribeObject.channel +
    // (ticker, orderbook)
    (subscribeObject.symbol || '') +
    // (orderbook)
    (subscribeObject.prec || '') +
    (subscribeObject.freq || '') +
    (subscribeObject.len || '') +
    // (candle)
    (subscribeObject.key || '')
  );
}
