export interface BinanceUserStreamAsset {
  // Asset
  a: string;
  // Free amount
  f: string;
  // Locked amount
  l: string;
}

export interface BinanceUserStreamAccount {
  // Event type
  e: 'outboundAccountInfo';
  // Event time
  E: number;
  // Maker commission rate (bips)
  m: number;
  // Taker commission rate (bips)
  t: number;
  // Buyer commission rate (bips)
  b: number;
  // Seller commission rate (bips)
  s: number;
  // Can trade?
  T: boolean;
  // Can withdraw?
  W: boolean;
  // Can deposit?
  D: boolean;
  // Time of last account update
  u: number;
  // Balances array
  B: BinanceUserStreamAsset[];
}

// {
//   "e": "outboundAccountInfo",   // Event type
//   "E": 1499405658849,           // Event time
//   "m": 0,                       // Maker commission rate (bips)
//   "t": 0,                       // Taker commission rate (bips)
//   "b": 0,                       // Buyer commission rate (bips)
//   "s": 0,                       // Seller commission rate (bips)
//   "T": true,                    // Can trade?
//   "W": true,                    // Can withdraw?
//   "D": true,                    // Can deposit?
//   "u": 1499405658848,           // Time of last account update
//   "B": [                        // Balances array
//     {
//       "a": "LTC",               // Asset
//       "f": "17366.18538083",    // Free amount
//       "l": "0.00000000"         // Locked amount
//     },
//     {
//       "a": "BTC",
//       "f": "10537.85314051",
//       "l": "2.19464093"
//     },
//     {
//       "a": "ETH",
//       "f": "17902.35190619",
//       "l": "0.00000000"
//     },
//     {
//       "a": "BNC",
//       "f": "1114503.29769312",
//       "l": "0.00000000"
//     },
//     {
//       "a": "NEO",
//       "f": "0.00000000",
//       "l": "0.00000000"
//     }
//   ]
// }

export interface BinanceUserStreamOrder {
  // Event type
  e: 'executionReport';
  // Event time
  E: number;
  // Symbol
  s: string;
  // Client order ID
  c: string;
  // Side
  S: string;
  // Order type
  o: string;
  // Time in force
  f: string;
  // Order quantity
  q: string;
  // Order price
  p: string;
  // Stop price
  P: string;
  // Iceberg quantity
  F: string;
  // Ignore
  g: string;
  // Original client order ID; This is the ID of the order being canceled
  C: string;
  // Current execution type
  x: string;
  // Current order status
  X: string;
  // Order reject reason; will be an error code.
  r: string;
  // Order ID
  i: string;
  // Last executed quantity
  l: string;
  // Cumulative filled quantity
  z: string;
  // Last executed price
  L: string;
  // Commission amount
  n: string;
  // Commission asset
  N: string;
  // Transaction time
  T: string;
  // Trade ID
  t: string;
  // Ignore
  I: string;
  // Is the order working? Stops will have
  w: string;
  // Is this trade the maker side?
  m: string;
  // Ignore
  M: string;
  // Order creation time
  O: string;
  // Cumulative quote asset transacted quantity
  Z: string;
}

// {
//   "e": "executionReport",        // Event type
//   "E": 1499405658658,            // Event time
//   "s": "ETHBTC",                 // Symbol
//   "c": "mUvoqJxFIILMdfAW5iGSOW", // Client order ID
//   "S": "BUY",                    // Side
//   "o": "LIMIT",                  // Order type
//   "f": "GTC",                    // Time in force
//   "q": "1.00000000",             // Order quantity
//   "p": "0.10264410",             // Order price
//   "P": "0.00000000",             // Stop price
//   "F": "0.00000000",             // Iceberg quantity
//   "g": -1,                       // Ignore
//   "C": "null",                   // Original client order ID; This is the ID of the order being canceled
//   "x": "NEW",                    // Current execution type
//   "X": "NEW",                    // Current order status
//   "r": "NONE",                   // Order reject reason; will be an error code.
//   "i": 4293153,                  // Order ID
//   "l": "0.00000000",             // Last executed quantity
//   "z": "0.00000000",             // Cumulative filled quantity
//   "L": "0.00000000",             // Last executed price
//   "n": "0",                      // Commission amount
//   "N": null,                     // Commission asset
//   "T": 1499405658657,            // Transaction time
//   "t": -1,                       // Trade ID
//   "I": 8641984,                  // Ignore
//   "w": true,                     // Is the order working? Stops will have
//   "m": false,                    // Is this trade the maker side?
//   "M": false,                    // Ignore
//   "O": 1499405658657,            // Order creation time
//   "Z": "0.00000000"              // Cumulative quote asset transacted quantity
// }
