import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { fetchRxjs } from '../../../common';
import { CandleStick } from '../../exchange-types';
import { WebsocketSubOrUnSubRequest } from '../bitfinex-common.types';
import { getSymbol } from '../bitfinex-common';
import { BitfinexWebsocket } from '../websocket';

import { getCandleStickUrl, adaptBitfinexRawCandleStick, getCandleTimeFrame } from './internal/functions';
import { BitfinexRawCandleStick } from './internal/types';

export class BitfinexCandleStick {
  private corsProxy: string;
  private bitfinexWebsocket: BitfinexWebsocket;

  /**
   *
   * @param corsProxy
   * @param bitfinexWebsocket
   */
  constructor(corsProxy?: string, bitfinexWebsocket?: BitfinexWebsocket) {
    this.corsProxy = corsProxy;
    this.bitfinexWebsocket = bitfinexWebsocket || new BitfinexWebsocket();
  }

  /**
   *
   * @param pair
   * @param minutesFoot
   * @param start
   * @param end
   */
  fetchCandleStickRange$(pair: string, minutesFoot: number, start: number, end: number): Observable<CandleStick[]> {
    // https://api.bitfinex.com/v2/candles/trade::TimeFrame::Symbol/Section
    const originUrl = getCandleStickUrl(pair, minutesFoot, start, end);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    return fetchRxjs<BitfinexRawCandleStick[]>(url).pipe(map(bitfinexCandles => bitfinexCandles.map(adaptBitfinexRawCandleStick)));
  }

  /**
   *
   * @param pair
   * @param minutesFoot
   */
  candlestick$(pair: string, minutesFoot: number): Observable<CandleStick> {
    const subscribeRequest = getCandleSubcribeRequest(pair, minutesFoot);

    return this.bitfinexWebsocket.subscribe<BitfinexRawCandleStick[] | BitfinexRawCandleStick>(subscribeRequest).pipe(
      // filter the first initial history data
      filter(candleArrayOrCandle => candleArrayOrCandle[0] && typeof candleArrayOrCandle[0] === 'number'),
      map((candle: BitfinexRawCandleStick) => adaptBitfinexRawCandleStick(candle))
    );
  }

  /**
   *
   * @param pair
   * @param minutesFoot
   */
  candlestickWithInitialHistory$(pair: string, minutesFoot: number): Observable<CandleStick[] | CandleStick> {
    const subscribeRequest = getCandleSubcribeRequest(pair, minutesFoot);

    return this.bitfinexWebsocket.subscribe<BitfinexRawCandleStick[] | BitfinexRawCandleStick>(subscribeRequest).pipe(
      map((candleArrayOrCandle) => {
        if (candleArrayOrCandle[0] && typeof candleArrayOrCandle[0] === 'object') {
          const initialCandles = <BitfinexRawCandleStick[]>candleArrayOrCandle;
          return initialCandles.map(adaptBitfinexRawCandleStick);
        }

        return adaptBitfinexRawCandleStick(<BitfinexRawCandleStick>candleArrayOrCandle);
      })
    );
  }

  /**
   *
   * @param pair
   * @param minutesFoot
   */
  stopCandleStick(pair: string, minutesFoot: number): void {
    const unsubscribeRequest = getCandleSubcribeRequest(pair, minutesFoot);
    this.bitfinexWebsocket.unsubscribe(unsubscribeRequest);
  }
}

/**
 *
 * @param pair
 * @param minutesFoot
 */
function getCandleSubcribeRequest(pair: string, minutesFoot: number): WebsocketSubOrUnSubRequest {
  const symbol = getSymbol(pair);
  const timeFrame = getCandleTimeFrame(minutesFoot);
  return {
    event: 'subscribe',
    channel: 'candles',
    key: `trade:${timeFrame}:${symbol}`
  };
}
