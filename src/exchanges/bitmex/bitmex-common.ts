export const apiEndPoint = 'https://www.bitmex.com/api';
export const wsEndpoint = 'wss://www.bitmex.com/realtime';

// get bitmex symbol xbt_usd => XBTUSD
export function getSymbol(pair: string): string {
  return pair.replace('_', '').toUpperCase();
}
