// {
//   symbol: 'EOSBTC',
//     priceChange: '-0.00002020',
//       priceChangePercent: '-1.198',
//         weightedAvgPrice: '0.00167920',
//           prevClosePrice: '0.00168580',
//             lastPrice: '0.00166660',
//               lastQty: '0.18000000',
//                 bidPrice: '0.00166410',
//                   bidQty: '47.00000000',
//                     askPrice: '0.00166660',
//                       askQty: '141.46000000',
//                         openPrice: '0.00168680',
//                           highPrice: '0.00172130',
//                             lowPrice: '0.00164580',
//                               volume: '4416596.40000000',
//                                 quoteVolume: '7416.34776757',
//                                   openTime: 1529037561982,
//                                     closeTime: 1529123961982,
//                                       firstId: 18293477,
//                                         lastId: 18425533,
//                                           count: 132057
// }
export interface BinanceRawRestTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export interface BinanceRawWsTicker {
  'e': string;      // Event type
  'E': number;      // Event time
  's': string;      // Symbol
  'p': string;      // Price change
  'P': string;      // Price change percent
  'w': string;      // Weighted average price
  'x': string;      // Previous day's close price
  'c': string;      // Current day's close price
  'Q': string;      // Close trade's quantity
  'b': string;      // Best bid price
  'B': string;      // Bid bid quantity
  'a': string;      // Best ask price
  'A': string;      // Best ask quantity
  'o': string;      // Open price
  'h': string;      // High price
  'l': string;      // Low price
  'v': string;      // Total traded base asset volume
  'q': string;      // Total traded quote asset volume
  'O': number;      // Statistics open time
  'C': number;      // Statistics close time
  'F': number;      // First trade ID
  'L': number;      // Last trade Id
  'n': number;      // Total number of trades
}
