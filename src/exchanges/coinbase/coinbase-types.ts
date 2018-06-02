// { "type": "subscribe", "product_ids": ["BTC-USD"], "channels": ["ticker"] }
export interface WebsocketRequest {
  type: 'subscribe' | 'unsubscribe';
  product_ids: string[];
  channels: string[];
}

export interface WebsocketSubscribeRequest extends WebsocketRequest {
  type: 'subscribe';
}

export interface WebsocketUnSubscribeRequest extends WebsocketRequest {
  type: 'unsubscribe';
}


// { "type": "subscriptions", "channels": [{ "name": "ticker", "product_ids": ["BTC-USD"] }] }
// { "type":"ticker","sequence":5994036198,"product_id":"BTC-USD","price":"7652.01000000","open_24h":"7580.00000000","volume_24h":"7490.10788184","low_24h":"7351.01000000","high_24h":"7697.09000000","volume_30d":"268954.72320294","best_bid":"7652","best_ask":"7652.01"}
export interface WebsocketMessageResponse {
  type: string; // 'ticker', heartbeat, l2update, snapshot
  product_id: string; // 'BTC-USD',
  time: string; // '2017-10-06T17:17:16.118000Z',
}

export interface CoinbaseRawTicker extends WebsocketMessageResponse {
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
