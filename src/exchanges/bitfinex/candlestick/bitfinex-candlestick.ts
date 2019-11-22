import fetch from 'node-fetch';

import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { CandleStick } from '../../exchange-types';
import { getSymbol } from '../bitfinex-common';
import { BitfinexWebsocket, WebsocketRequestBaseI } from '../websocket';

import { getCandleStickUrl, adaptBitfinexRawCandleStick, getCandleTimeFrame } from './internal/functions';
import { BitfinexRawCandleStick } from './internal/types';

export class BitfinexCandleStick {
  /**
   *
   * @param corsProxy
   * @param bitfinexWebsocket
   */
  constructor(private readonly corsProxy: string = '', private readonly bitfinexWebsocket: BitfinexWebsocket) {}

  /**
   *
   * @param pair
   * @param minutesFoot
   * @param start
   * @param end
   */
  async fetchCandleStickRange(pair: string, minutesFoot: number, start: number, end: number): Promise<CandleStick[]> {
    // https://api.bitfinex.com/v2/candles/trade::TimeFrame::Symbol/Section
    const originUrl = getCandleStickUrl(pair, minutesFoot, start, end);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    const bitfinexCandles: BitfinexRawCandleStick[] = await fetch(url).then(res => res.json());

    return bitfinexCandles.reverse().map(adaptBitfinexRawCandleStick);
  }

  /**
   *
   * @param pair
   * @param minutesFoot
   */
  candlestick$(pair: string, minutesFoot: number): Observable<CandleStick> {
    const subscribeRequest = getCandleSubcribeRequest(pair, minutesFoot);

    return this.bitfinexWebsocket.subscribeChannel<BitfinexRawCandleStick[] | BitfinexRawCandleStick>(subscribeRequest).pipe(
      // filter the first initial history data
      filter((candleArrayOrCandle) => typeof candleArrayOrCandle[0] === 'number'),
      map((candle) => adaptBitfinexRawCandleStick(<BitfinexRawCandleStick>candle)),
    );
  }

  /**
   *
   * @param pair
   * @param minutesFoot
   */
  candlestickWithInitialHistory$(pair: string, minutesFoot: number): Observable<CandleStick[] | CandleStick> {
    const subscribeRequest = getCandleSubcribeRequest(pair, minutesFoot);

    return this.bitfinexWebsocket.subscribeChannel<BitfinexRawCandleStick[] | BitfinexRawCandleStick>(subscribeRequest).pipe(
      map((candleArrayOrCandle) => {
        if (candleArrayOrCandle[0] && typeof candleArrayOrCandle[0] === 'object') {
          const initialCandles = <BitfinexRawCandleStick[]>candleArrayOrCandle;

          return initialCandles.map(adaptBitfinexRawCandleStick);
        }

        return adaptBitfinexRawCandleStick(<BitfinexRawCandleStick>candleArrayOrCandle);
      }),
    );
  }

  /**
   *
   * @param pair
   * @param minutesFoot
   */
  async stopCandleStick(pair: string, minutesFoot: number): Promise<void> {
    const unsubscribeRequest = getCandleSubcribeRequest(pair, minutesFoot);
    await this.bitfinexWebsocket.unsubscribeChannel(unsubscribeRequest);
  }
}

/**
 *
 * @param pair
 * @param minutesFoot
 */
function getCandleSubcribeRequest(pair: string, minutesFoot: number): WebsocketRequestBaseI {
  const symbol = getSymbol(pair);
  const timeFrame = getCandleTimeFrame(minutesFoot);

  return {
    channel: 'candles',
    key: `trade:${timeFrame}:${symbol}`,
  };
}
