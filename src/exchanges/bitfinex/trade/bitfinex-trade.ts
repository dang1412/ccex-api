import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { fetchRxjs } from '../../../common';
import { Trade } from '../../exchange-types';
import { getSymbol } from '../bitfinex-common';
import { WebsocketSubOrUnSubRequest } from '../bitfinex-common.types';
import { BitfinexWebsocket } from '../websocket';

import { getTradesUrl, adaptBitfinexTrade } from './internal/functions';
import { BitfinexRawTrade } from './internal/types';

export class BitfinexTrade {
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

  // fetch trades
  fetchTrades$(pair: string, start?: number, end?: number, limit?: number, sort?: number): Observable<Trade[]> {
    const originUrl = getTradesUrl(pair, start, end, limit, sort);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    return fetchRxjs<BitfinexRawTrade[]>(url).pipe(
      map(trades => trades.map(adaptBitfinexTrade))
    );
  }

  trade$(pair: string): Observable<Trade> {
    const subcribeRequest = getTradeSubcribeRequest(pair);
    return this.bitfinexWebsocket.subscribe<BitfinexRawTrade[] | BitfinexRawTrade>(subcribeRequest).pipe(
      filter(tradeArrayOrTrade => tradeArrayOrTrade[0] && typeof tradeArrayOrTrade[0] === 'number'),
      map((trade: BitfinexRawTrade) => adaptBitfinexTrade(trade))
    );
  }

  tradeWithInitialHistory$(pair: string): Observable<Trade[] | Trade> {
    const subcribeRequest = getTradeSubcribeRequest(pair);
    return this.bitfinexWebsocket.subscribe<BitfinexRawTrade[] | BitfinexRawTrade>(subcribeRequest).pipe(
      map((tradeArrayOrTrade) => {
        if (tradeArrayOrTrade[0] && typeof tradeArrayOrTrade[0] === 'object') {
          const initialTrades = <BitfinexRawTrade[]>tradeArrayOrTrade;
          return initialTrades.map(adaptBitfinexTrade);
        }

        return adaptBitfinexTrade(<BitfinexRawTrade>tradeArrayOrTrade);
      })
    );
  }

  stopTrade(pair: string): void {
    const unsubscribeRequest = getTradeSubcribeRequest(pair);
    // not use event when unsubscribe, delete to avoid confusing
    delete unsubscribeRequest.event;
    this.bitfinexWebsocket.unsubscribe(unsubscribeRequest);
  }
}

function getTradeSubcribeRequest(pair: string): WebsocketSubOrUnSubRequest {
  return {
    event: 'subscribe',
    channel: 'trades',
    symbol: getSymbol(pair)
  };
}
