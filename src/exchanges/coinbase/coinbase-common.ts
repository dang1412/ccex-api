export const apiEndpoint = 'https://api.pro.coinbase.com';
export const websocketEndpoint = 'wss://ws-feed.pro.coinbase.com';

// btc_usd => BTC-USD
export function getProductId(pair: string): string {
  return pair.replace('_', '-').toUpperCase();
}
