export const apiEndPoint = 'https://api.sample.com';
export const wsEndpoint = 'wss://www.sample.com/realtime';

// get sample pair
export function samplePair(pair: string): string {
  return pair.replace('_', '').toUpperCase();
}
