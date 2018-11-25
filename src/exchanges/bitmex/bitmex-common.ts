export const apiEndPoint = 'https://www.bitmex.com/api/v1';
export const wsEndpoint = 'wss://www.bitmex.com/realtime';

// get bitmex pair
export function bitmexPair(pair: string): string {
  return pair.replace('_', '').toUpperCase();
}
