/**
 * Trade
 */

export type BitfinexRawTrade = [
  // ID,
  number,
  // MTS: millisecond time stamp
  number,
  // AMOUNT: How much was bought (positive) or sold (negative).
  number,
  // PRICE
  number
];
