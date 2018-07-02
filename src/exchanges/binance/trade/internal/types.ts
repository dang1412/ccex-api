export interface BinanceRawRestTrade {
  id: number;
  price: string;
  qty: string;
  time: number;
  isBuyerMaker: boolean;
  isBestMatch: boolean;
}

export interface BinanceRawWsTrade {
  // Event type
  e: 'trade';
  // Event time
  E: number;
  // Symbol
  s: string;
  // Trade ID
  t: number;
  // Price
  p: string;
  // Quantity
  q: string;
  // Buyer order Id
  b: number;
  // Seller order Id
  a: number;
  // Trade time
  T: number;
  // Is the buyer the market maker?
  m: boolean;
}
