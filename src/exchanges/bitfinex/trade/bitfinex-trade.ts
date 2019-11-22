import fetch from 'node-fetch';

import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { Trade } from '../../exchange-types';
import { getSymbol } from '../bitfinex-common';
import { BitfinexWebsocket, WebsocketRequestBaseI } from '../websocket';

import { getTradesUrl, adaptBitfinexTrade } from './internal/functions';
import { BitfinexRawTrade } from './internal/types';

export class BitfinexTrade {
  /**
   *
   * @param corsProxy
   * @param bitfinexWebsocket
   */
  constructor(private readonly corsProxy: string = '', private readonly bitfinexWebsocket: BitfinexWebsocket) {}

  // fetch trades
  async fetchTrades(pair: string, start?: number, end?: number, limit?: number, sort?: number): Promise<Trade[]> {
    const originUrl = getTradesUrl(pair, start, end, limit, sort);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    const rawTrades: BitfinexRawTrade[] = await fetch(url).then(res => res.json());

    return rawTrades.map(adaptBitfinexTrade);
  }

  /**
   * latest trade only
   *
   * @param pair
   */
  trade$(pair: string): Observable<Trade> {
    const subcribeRequest = getTradeRequest(pair);

    return this.bitfinexWebsocket.subscribeChannel<BitfinexRawTrade[] | BitfinexRawTrade>(subcribeRequest).pipe(
      filter((tradeArrayOrTrade) => typeof tradeArrayOrTrade[0] === 'number'),
      map((trade) => adaptBitfinexTrade(<BitfinexRawTrade>trade)),
    );
  }

  /**
   * trade array at first
   *
   * @param pair
   */
  tradeWithInitialHistory$(pair: string): Observable<Trade[] | Trade> {
    const subcribeRequest = getTradeRequest(pair);

    return this.bitfinexWebsocket.subscribeChannel<BitfinexRawTrade[] | BitfinexRawTrade>(subcribeRequest).pipe(
      map((tradeArrayOrTrade) => {
        // array trade
        if (tradeArrayOrTrade[0] && typeof tradeArrayOrTrade[0] === 'object') {
          const initialTrades = <BitfinexRawTrade[]>tradeArrayOrTrade;

          return initialTrades.map(adaptBitfinexTrade);
        }

        // single trade
        return adaptBitfinexTrade(<BitfinexRawTrade>tradeArrayOrTrade);
      }),
    );
  }

  async stopTrade(pair: string): Promise<void> {
    const unsubscribeRequest = getTradeRequest(pair);
    await this.bitfinexWebsocket.unsubscribeChannel(unsubscribeRequest);
  }
}

function getTradeRequest(pair: string): WebsocketRequestBaseI {
  return {
    channel: 'trades',
    symbol: getSymbol(pair),
  };
}
