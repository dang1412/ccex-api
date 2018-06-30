import { WebsocketMessageResponse } from '../../coinbase-common.types';

export interface CoinbaseRawWsTicker extends WebsocketMessageResponse {
  sequence: number; // 4163689926,
  price: string; // '4387.95000000',
  open_24h: string; // '4305.09000000',
  volume_24h: string; // '6333.47909087',
  low_24h: string; // '4387.95000000',
  high_24h: string; // '4407.00000000',
  volume_30d: string; // '393681.12140634',
  best_bid: string; // '4387.94',
  best_ask: string; // '4387.95',
  side: string; // 'buy',
  trade_id: number; // 21659949,
  last_size: string; // '0.00001363'
}

export interface CoinbaseRawRestTicker {
  trade_id: number;
  price: string;
  size: string;
  bid: string;
  ask: string;
  volume: string;
  time: string;
}
