/**
 * This file contains common pure helpful functions
 */

import { CandleStick, Trade } from './exchange-types';

/**
 * @param candle 
 * @param trade 
 * @param minutesFoot 
 */
export function updateLastCandleWithNewTrade(candle: CandleStick, trade: Trade, minutesFoot: number): CandleStick {
  const candleEndTimestamp = candle.timestamp + minutesFoot * 60000;
  // ignore the trade if its timestamp is old
  if (trade.timestamp < candle.timestamp) {
    return candle;
  }

  // update the candle with new trade
  if (trade.timestamp <= candleEndTimestamp) {
    return {
      open: candle.open,
      high: Math.max(candle.high, trade.price),
      low: Math.min(candle.low, trade.price),
      close: trade.price,
      volume: candle.volume + trade.amount,
      timestamp: candle.timestamp,
    }
  }

  // create new candle with only 1 trade
  return {
    open: trade.price,
    high: trade.price,
    low: trade.price,
    close: trade.price,
    volume: trade.amount,
    timestamp: convertToCandleTimestamp(trade.timestamp, minutesFoot),
  }
}


/**
 * @param timestamp 
 * @param minutesFoot 
 */
export function convertToCandleTimestamp(timestamp: number, minutesFoot: number): number {
  return timestamp - (timestamp % (minutesFoot * 60000));
}
