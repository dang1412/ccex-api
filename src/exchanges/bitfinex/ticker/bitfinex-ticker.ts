import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Ticker } from '../../exchange-types';
import { getSymbol } from '../bitfinex-common';
import { BitfinexWebsocket } from '../websocket';

import { adaptBitfinexTicker } from './internal/functions';
import { BitfinexRawTicker } from './internal/types';

export class BitfinexTicker {
  private bitfinexWebsocket: BitfinexWebsocket;

  constructor(bitfinexWebsocket?: BitfinexWebsocket) {
    this.bitfinexWebsocket = bitfinexWebsocket || new BitfinexWebsocket();
  }

  ticker$(pair: string): Observable<Ticker> {
    // { "event": "subscribe", "channel": "ticker", "symbol": "tEOSETH" }
    const subscribeRequest = {
      event: 'subscribe',
      channel: 'ticker',
      symbol: getSymbol(pair),
    };

    return this.bitfinexWebsocket
      .subscribe<BitfinexRawTicker>(subscribeRequest)
      .pipe(map((bitfinexTicker) => adaptBitfinexTicker(bitfinexTicker, pair)));
  }

  stopTicker(pair: string): void {
    const unsubscribeRequest = {
      channel: 'ticker',
      symbol: getSymbol(pair),
    };

    this.bitfinexWebsocket.unsubscribe(unsubscribeRequest);
  }
}
