export interface BinanceOrderbookType {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

// {
//   "e": "depthUpdate", // Event type
//   "E": 123456789,     // Event time
//   "s": "BNBBTC",      // Symbol
//   "U": 157,           // First update ID in event
//   "u": 160,           // Final update ID in event
//   "b": [              // Bids to be updated
//     [
//       "0.0024",       // Price level to be updated
//       "10"            // Quantity
//     ]
//   ],
//   "a": [              // Asks to be updated
//     [
//       "0.0026",       // Price level to be updated
//       "100"           // Quantity
//     ]
//   ]
// }
export interface BinanceWsUpdateOrderbook {
  // event type 'depthUpdate'
  e: 'depthUpdate';
  // event time
  E: number;
  // symbol 'BNBBTC'
  s: string;
  // first update id
  U: number;
  // last update id
  u: number;
  // bids
  b: [string, string][];
  // asks
  a: [string, string][];
}
