import { Observable, concat } from 'rxjs';
import { map, take, filter, bufferTime, scan } from 'rxjs/operators';

import { updateOrderbook } from '../../../helpers';
import { Orderbook } from '../../exchange-types';
import { WebsocketSubOrUnSubRequest } from '../bitfinex-common.types';
import { getSymbol, getKey } from '../bitfinex-common';
import { BitfinexWebsocket } from '../websocket';

import { adaptBitfinexOrderbook, arrangeBitfinexOrderbookItems } from './internal/functions';
import { BitfinexOrderbookSingleItem } from './internal/types';

export class BitfinexOrderbook {
  private bitfinexWebsocket: BitfinexWebsocket;
  private keyOderbookStreamMap: { [key: string]: Observable<Orderbook> } = {};

  constructor(bitfinexWebsocket?: BitfinexWebsocket) {
    this.bitfinexWebsocket = bitfinexWebsocket || new BitfinexWebsocket();
  }

  orderbook$(pair: string, prec = 'P0', freq = 'F0', len = '25'): Observable<Orderbook> {
    const subscribeRequest: WebsocketSubOrUnSubRequest = {
      event: 'subscribe',
      channel: 'book',
      symbol: getSymbol(pair),
      prec,
      freq,
      len
    };

    const key = getKey(subscribeRequest);
    if (!this.keyOderbookStreamMap[key]) {
      this.keyOderbookStreamMap[key] = this.startOrderbook$(subscribeRequest);
    }

    return this.keyOderbookStreamMap[key];
  }

  stopOrderbook(pair: string, prec = 'P0', freq = 'F0', len = '25'): void {
    const unsubscribeRequest = {
      channel: 'book',
      symbol: getSymbol(pair),
      prec,
      freq,
      len
    };

    const key = getKey(unsubscribeRequest);
    delete this.keyOderbookStreamMap[key];
    this.bitfinexWebsocket.unsubscribe(unsubscribeRequest);
  }

  /**
   * Start subscribe to the orderbook for the first time
   * @param subscribeRequest
   */
  private startOrderbook$(subscribeRequest: WebsocketSubOrUnSubRequest): Observable<Orderbook> {
    const orderbookSnapshotAndUpdate$ = this.bitfinexWebsocket
      .subscribe<BitfinexOrderbookSingleItem[] | BitfinexOrderbookSingleItem>(subscribeRequest);

    // snapshot (array of items) come at first
    const orderbookSnapshot$ = orderbookSnapshotAndUpdate$.pipe(
      filter((snapshot) => !!snapshot && !!snapshot.length),
      map((snapshot: any) => {
        // this case is not expected (1 item come instead of array),
        // happen when the stream is hot (ws channel already subscribed before),
        // make snapshot the array of items
        if (typeof snapshot[0] === 'number' ) {
          snapshot = [snapshot];
        }

        return <BitfinexOrderbookSingleItem[]>snapshot;
      }),
      map(adaptBitfinexOrderbook),
      take(1),
    );

    // orderbook updates, buffer some changes in 1 second into 1 to improve performance
    const orderbookUpdate$ = orderbookSnapshotAndUpdate$.pipe(
      filter(orderbookItem => orderbookItem && orderbookItem.length && typeof orderbookItem[0] === 'number'),
      bufferTime(1000),
      map((orderbookItems: BitfinexOrderbookSingleItem[]) => arrangeBitfinexOrderbookItems(orderbookItems)),
      map(adaptBitfinexOrderbook),
    );

    return concat(orderbookSnapshot$, orderbookUpdate$).pipe(
      scan((orderbook, update) => updateOrderbook(orderbook, update))
    );
  }
}
