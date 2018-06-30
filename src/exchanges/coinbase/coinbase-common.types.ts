// { "type": "subscribe", "product_ids": ["BTC-USD"], "channels": ["ticker"] }
export interface WebsocketRequest {
  type: 'subscribe' | 'unsubscribe';
  product_ids: string[];
  channels: string[];
}

// { "type": "subscriptions", "channels": [{ "name": "ticker", "product_ids": ["BTC-USD"] }] }
// { "type":"ticker","sequence":5994036198,"product_id":"BTC-USD","price":"7652.01000000","open_24h":"7580.00000000","volume_24h":"7490.10788184","low_24h":"7351.01000000","high_24h":"7697.09000000","volume_30d":"268954.72320294","best_bid":"7652","best_ask":"7652.01"}
export interface WebsocketMessageResponse {
  // ticker, heartbeat, l2update, snapshot
  type: string;
  // 'BTC-USD',
  product_id: string;
  // '2017-10-06T17:17:16.118000Z',
  time: string;
}
