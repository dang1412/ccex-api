import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Ticker } from '../exchange-types';
import { BitfinexTickerI } from './bitfinex-types';
import { BitfinexWebsocket } from './bitfinex-websocket';
import { adaptBitfinexTicker, getSymbol } from './bitfinex-functions';

export class BitfinexTicker {
  private bitfinexWs: BitfinexWebsocket;

  constructor(bitfinexWs: BitfinexWebsocket) {
    this.bitfinexWs = bitfinexWs;
  }

  ticker$(pair: string): Observable<Ticker> {
    // { "event": "subscribe", "channel": "ticker", "symbol": "tEOSETH" }
    const subscribeRequest = {
      event: 'subscribe',
      channel: 'ticker',
      symbol: getSymbol(pair)
    }

    return this.bitfinexWs.subscribe<BitfinexTickerI>(subscribeRequest).pipe(
      map(bitfinexTicker => adaptBitfinexTicker(bitfinexTicker, pair))
    );
  }
}
