export const apiEndPoint = 'https://api.binance.com';
export const wsEndpoint = 'wss://stream2.binance.com:9443/ws/';

// get binance pair
export function binancePair(pair: string): string {
  return pair.replace('_', '').toLowerCase();
}
