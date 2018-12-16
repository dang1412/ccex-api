export const wsEndpoint = 'wss://api.bitfinex.com/ws/2';
export const apiEndpoint = 'https://api.bitfinex.com/v2';

export function getSymbol(pair: string): string {
  return `t${pair.replace('_', '').toUpperCase()}`;
}
