import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { Trade } from '../../exchange-types';
import { getSymbol } from '../bitfinex-common';
import { BitfinexWebsocket, WebsocketRequestBase } from '../websocket';

import { getTradesUrl, adaptBitfinexTrade } from './internal/functions';
import { BitfinexRawTrade } from './internal/types';
import { ajax } from 'rxjs/ajax';

export class BitfinexTrade {
  /**
   *
   * @param corsProxy
   * @param bitfinexWebsocket
   */
  constructor(private readonly corsProxy: string = '', private readonly bitfinexWebsocket: BitfinexWebsocket) {}

  // fetch trades
  fetchTrades$(pair: string, start?: number, end?: number, limit?: number, sort?: number): Observable<Trade[]> {
    const originUrl = getTradesUrl(pair, start, end, limit, sort);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    return ajax.getJSON<BitfinexRawTrade[]>(url).pipe(map((trades) => trades.map(adaptBitfinexTrade)));
  }

  /**
   * latest trade only
   *
   * @param pair
   */
  trade$(pair: string): Observable<Trade> {
    const subcribeRequest = getTradeRequest(pair);

    return this.bitfinexWebsocket.subscribe<BitfinexRawTrade[] | BitfinexRawTrade>(subcribeRequest).pipe(
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

    return this.bitfinexWebsocket.subscribe<BitfinexRawTrade[] | BitfinexRawTrade>(subcribeRequest).pipe(
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

  stopTrade(pair: string): void {
    const unsubscribeRequest = getTradeRequest(pair);
    this.bitfinexWebsocket.unsubscribe(unsubscribeRequest);
  }
}

function getTradeRequest(pair: string): WebsocketRequestBase {
  return {
    channel: 'trades',
    symbol: getSymbol(pair),
  };
}
