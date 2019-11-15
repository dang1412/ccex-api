import { Observable } from 'rxjs';
import { Trade } from '../../exchange-types';
import { getSymbol } from '../bitmex-common';
import { BitmexWebsocket } from '../websocket';
import { BitmexTradeWebsocketData, adaptBitmexTrade } from './internal';
import { map } from 'rxjs/operators';

export class BitmexTrade {
  /**
   *
   * @param corsProxy
   * @param bitfinexWebsocket
   */
  constructor(private readonly corsProxy: string = '', private readonly bitmexWebsocket: BitmexWebsocket) {}

  // fetch trades
  async fetchTrades(pair: string, start?: number, end?: number, limit?: number, sort?: number): Promise<Trade[] | undefined> {
    return Promise.resolve(undefined);
  }

  /**
   * latest trade
   *
   * @param pair
   */
  trade$(pair: string): Observable<Trade> {
    const channel = getTradeChannel(pair);

    return this.bitmexWebsocket.subscribe<BitmexTradeWebsocketData>(channel).pipe(map((wsData) => adaptBitmexTrade(wsData.data[0])));
  }

  stopTrade(pair: string): void {
    const channel = getTradeChannel(pair);
    this.bitmexWebsocket.unsubscribe(channel);
  }
}

function getTradeChannel(pair: string): string {
  const symbol = getSymbol(pair);

  return `trade:${symbol}`;
}
