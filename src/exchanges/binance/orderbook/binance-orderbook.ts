import { Observable, concat, from, merge, ReplaySubject } from 'rxjs';
import { map, scan, buffer, take, mergeMap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

import { WebSocketRxJs } from '../../../common';
import { updateOrderbook } from '../../../helpers';
import { Orderbook } from '../../exchange-types';
import { BinanceRawOrderbook, BinanceRawWsOrderbook } from './internal/types';
import { binanceOrderbookApiUrl, binanceOrderbookChannel, adaptBinanceWsOrderbook } from './internal/functions';

export class BinanceOrderbook {
  private readonly pairStreamMap: { [pair: string]: ReplaySubject<Orderbook> } = {};
  private readonly pairSocketMap: { [pair: string]: WebSocketRxJs } = {};
  private readonly corsProxy: string;

  constructor(corsProxy: string = '') {
    this.corsProxy = corsProxy;
  }

  fetchOrderbook$(pair: string, limit: number = 20): Observable<Orderbook> {
    const originUrl = binanceOrderbookApiUrl(pair, limit);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    return ajax.getJSON<BinanceRawOrderbook>(url);
  }

  orderbook$(pair: string): Observable<Orderbook> {
    if (!this.pairStreamMap[pair]) {
      this.pairStreamMap[pair] = new ReplaySubject<Orderbook>(1);
      this.startOrderbook$(pair).subscribe((orderbook) => this.pairStreamMap[pair].next(orderbook));
    }

    return this.pairStreamMap[pair].asObservable();
  }

  stopOrderbook(pair: string): void {
    if (this.pairSocketMap[pair]) {
      // close socket also cause the stream to complete
      this.pairSocketMap[pair].close();
      delete this.pairSocketMap[pair];
    }

    if (this.pairStreamMap[pair]) {
      this.pairStreamMap[pair].complete();
      delete this.pairStreamMap[pair];
    }
  }

  private startOrderbook$(pair: string): Observable<Orderbook> {
    const channel = binanceOrderbookChannel(pair);
    const ws = new WebSocketRxJs<BinanceRawWsOrderbook>(channel);
    this.pairSocketMap[pair] = ws;

    // orderbook fetched from rest api stream
    const fetchOrderbook$ = this.fetchOrderbook$(pair);
    // orderbook (diff) realtime stream
    const update$ = ws.message$.pipe(map(adaptBinanceWsOrderbook));
    // orderbook (diff) realtime stream, buffered in time range: [fetch start => fetch done]
    const updateBufferBeforeFetchDone$ = update$.pipe(
      buffer(fetchOrderbook$),
      take(1),
      mergeMap((orderbooks) => {
        return from(orderbooks);
      }),
    );

    // start these 2 streams concurrently at first, data come in order and then complete:
    //  - orderbook rest api fetch,
    //  - realtime update orderbooks in time range of [fetch start => fetch done]
    //  - complete
    const initOrderbook$ = merge(fetchOrderbook$, updateBufferBeforeFetchDone$);

    // after init orderbooks come, keep listening to diff orderbook stream and reflect it in current orderbook
    return concat(initOrderbook$, update$).pipe(
      scan<Orderbook>((orderbook, update) => {
        if (!orderbook.lastUpdateId || !update.lastUpdateId) {
          return updateOrderbook(orderbook, update);
        }

        return orderbook.lastUpdateId >= update.lastUpdateId ? orderbook : updateOrderbook(orderbook, update);
      }),
    );
  }
}
