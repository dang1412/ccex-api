/**
 * Candlestick
 */

export type BitfinexRawCandleStick = [
  // MTS int millisecond time stamp
  number,
  // OPEN	float	First execution during the time frame
  number,
  // CLOSE	float	Last execution during the time frame
  number,
  // HIGH	float	Highest execution during the time frame
  number,
  // LOW	float	Lowest execution during the timeframe
  number,
  // VOLUME	float	Quantity of symbol traded within the timeframe
  number
];
