export const apiEndPoint = 'https://api.bitmex.com';
export const wsEndpoint = 'wss://www.bitmex.com/realtime';

// get bitmex pair
export function bitmexPair(pair: string): string {
  return pair.replace('_', '').toUpperCase();
}
