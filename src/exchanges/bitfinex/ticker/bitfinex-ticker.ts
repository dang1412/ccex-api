import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Ticker } from '../../exchange-types';
import { BitfinexRawTicker } from '../bitfinex-types';
import { BitfinexWebsocket } from '../bitfinex-websocket';
import { adaptBitfinexTicker, getSymbol } from '../bitfinex-functions';

export class BitfinexTicker {
  private bitfinexWebsocket: BitfinexWebsocket;

  constructor(bitfinexWs?: BitfinexWebsocket) {
    this.bitfinexWebsocket = bitfinexWs || new BitfinexWebsocket();
  }

  ticker$(pair: string): Observable<Ticker> {
    // { "event": "subscribe", "channel": "ticker", "symbol": "tEOSETH" }
    const subscribeRequest = {
      event: 'subscribe',
      channel: 'ticker',
      symbol: getSymbol(pair)
    }

    return this.bitfinexWebsocket.subscribe<BitfinexRawTicker>(subscribeRequest).pipe(
      map(bitfinexTicker => adaptBitfinexTicker(bitfinexTicker, pair))
    );
  }

  stopTicker(pair: string): void {
    const unsubscribeRequest = {
      channel: 'ticker',
      symbol: getSymbol(pair)
    };

    this.bitfinexWebsocket.unsubscribe(unsubscribeRequest);
  }
}
