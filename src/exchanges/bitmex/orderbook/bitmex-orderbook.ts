import { EMPTY, Observable, concat } from 'rxjs';
import { Orderbook } from '../../exchange-types';
import { getSymbol } from '../bitmex-common';
import { BitmexWebsocket } from '../websocket';
import { filter, take, scan, map } from 'rxjs/operators';
import { bitmexUpdateOrderbook, adaptBitmexOrderbook, BitmexOrderbookWebsocketData } from './internal';

export class BitmexOrderbook {
  private readonly pairOderbookStreamMap = new Map<string, Observable<Orderbook>>();

  /**
   * @param corsProxy
   * @param bitfinexWebsocket
   */
  constructor(private readonly corsProxy: string = '', private readonly bitmexWebsocket: BitmexWebsocket) { }

  fetchOrderbook$(pair: string): Observable<Orderbook> {
    return EMPTY;
  }

  orderbook$(pair: string): Observable<Orderbook> {
    let stream = this.pairOderbookStreamMap.get(pair);
    if (!stream) {
      stream = this.startOrderbook$(pair);
      this.pairOderbookStreamMap.set(pair, stream);
    }

    return stream;
  }

  stopOrderbook(pair: string): void {
    const channel = getOrderbookChannel(pair);
    this.bitmexWebsocket.unsubscribe(channel);
    this.pairOderbookStreamMap.delete(pair);
  }

  private startOrderbook$(pair: string): Observable<Orderbook> {
    const channel = getOrderbookChannel(pair);

    const data$ = this.bitmexWebsocket.subscribe<BitmexOrderbookWebsocketData>(channel);

    /*
     * Make sure 'partial' come first and then 'insert' 'update' 'delete'
     */
    const snapshot$ = data$.pipe(
      filter(orderbookData => orderbookData.action === 'partial'),
      take(1),
    );

    const update$ = data$.pipe(
      filter(orderbookData => orderbookData.action === 'update' || orderbookData.action === 'insert' || orderbookData.action === 'delete'),
    );

    return concat(snapshot$, update$).pipe(scan(bitmexUpdateOrderbook), map(adaptBitmexOrderbook));
  }
}

function getOrderbookChannel(pair: string): string {
  const symbol = getSymbol(pair);

  return `orderBookL2_25:${symbol}`;
}
