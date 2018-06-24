import { Ticker, Orderbook, CandleStick } from '../exchange-types';
import { BitfinexRawTicker, BitfinexOrderbookSingleItem, WebsocketSubOrUnSubRequest, WebsocketRequestResponse, BitfinexRawCandleStick } from './bitfinex-types';
import { apiEndpoint } from './bitfinex-common';

export function getSymbol(pair: string): string {
  return 't' + pair.replace('_', '').toUpperCase();
}

export function getKey(subscribeObject: WebsocketSubOrUnSubRequest | WebsocketRequestResponse): string {
  return subscribeObject.channel
    // (ticker, orderbook)
    + (subscribeObject.symbol || '')

    // (orderbook)
    + (subscribeObject.prec || '')
    + (subscribeObject.freq || '')
    + (subscribeObject.len || '')

    // (candle)
    + (subscribeObject.key || '');
}

export function adaptBitfinexTicker(bitfinexTicker: BitfinexRawTicker, pair: string): Ticker {
  return {
    pair,
    ask: bitfinexTicker[2],
    bid: bitfinexTicker[0],
    low: bitfinexTicker[9],
    high: bitfinexTicker[8],
    last: bitfinexTicker[6],
    vol: bitfinexTicker[7],
    change24: bitfinexTicker[4],
    change24Perc: bitfinexTicker[5],
    timestamp: new Date().getTime(),
  };
}

// assuming that all bids and asks are in the right order (bids: DESC, asks: ASC)
export function adaptBitfinexOrderbook(bitfinexOrderbook: BitfinexOrderbookSingleItem[]): Orderbook {
  const orderbook: Orderbook = {
    bids: [],
    asks: [],
  };

  bitfinexOrderbook.forEach((orderbookItem) => {
    // if count === 0 set amoumt 0
    const amount = (orderbookItem[1] > 0 ? Math.abs(orderbookItem[2]) : 0) + '';
    const price = orderbookItem[0] + '';
    if (orderbookItem[2] > 0) {
      orderbook.bids.push([price,amount]);
    } else {
      orderbook.asks.push([price, amount]);
    }
  });

  return orderbook;
}

// arrange bids and asks in the right order (bids: DESC, asks: ASC)
export function arrangeBitfinexOrderbookItems(bitfinexOrderbook: BitfinexOrderbookSingleItem[]): BitfinexOrderbookSingleItem[] {
  const bids = bitfinexOrderbook.filter(item => item[2] > 0).sort((i1, i2) => i2[0] - i1[0]);
  const asks = bitfinexOrderbook.filter(item => item[2] < 0).sort((i1, i2) => i1[0] - i2[0]);

  return bids.concat(asks);
}

export function getCandleStickUrl(pair: string, minutesFoot: number, start?: number, end?: number, limit?: number, sort = 1): string {
  // https://api.bitfinex.com/v2/candles/trade::TimeFrame::Symbol/Section
  // `${url}/candles/trade:1m:tBTCUSD/hist`,
  const symbol = getSymbol(pair);
  const timeFrame = getCandleTimeFrame(minutesFoot);
  let url = `${apiEndpoint}/candles/trade:${timeFrame}:${symbol}/hist?sort=${sort}`;

  if (start) {
    url += `&start=${start}`;
  }
  if (end) {
    url += `&end=${end}`;
  }
  if (limit) {
    url += `&limit=${limit}`;
  }

  return url;
}

export function adaptBitfinexRestCandle(bitfinexCandle: BitfinexRawCandleStick): CandleStick {
  return {
    open: +bitfinexCandle[1],
    high: +bitfinexCandle[2],
    low: +bitfinexCandle[3],
    close: +bitfinexCandle[4],
    volume: +bitfinexCandle[5],
    timestamp: bitfinexCandle[0],
  }
}

export function getCandleTimeFrame(minutesFoot: number): string {
  return minutesTimeFrameMap[minutesFoot] || '';
}

// '1m', '5m', '15m', '30m', '1h', '3h', '6h', '12h', '1D', '7D', '14D', '1M'
const minutesTimeFrameMap = {
  1: '1m',
  5: '5m',
  15: '15m',
  30: '30m',
  60: '1h',
  180: '3h',
  360: '6h',
  720: '12h',
  1440: '1D',
  10080: '7D',
  20160: '14D',
}
