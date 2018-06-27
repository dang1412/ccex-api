/**
 * Orderbook types
 */

export type BitfinexOrderbookSingleItem = [
  // price
  number,
  // count
  number,
  // amount
  // - (> 0): bids
  // - (< 0): asks
  number
];
