import fetch from 'node-fetch';

import { Observable, concat, from, merge } from 'rxjs';
import { map, scan, buffer, take, mergeMap } from 'rxjs/operators';

import { updateOrderbook } from '../../../helpers';
import { Orderbook } from '../../exchange-types';
import { BinanceWsUpdateOrderbook } from './internal/types';
import { binanceOrderbookApiUrl, adaptBinanceWsOrderbook, getOrderbookChannel } from './internal/functions';
import { BinanceWebsocket } from '../websocket';

export class BinanceOrderbook {
  private readonly cacheStreams = new Map<string, Observable<Orderbook>>();

  /**
   *
   * @param binanceWebsocket
   * @param corsProxy
   */
  constructor(private readonly binanceWebsocket: BinanceWebsocket, private readonly corsProxy: string = '') {}

  async fetch(pair: string, limit: number = 20): Promise<Orderbook> {
    const originUrl = binanceOrderbookApiUrl(pair, limit);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    // type BinanceRawOrderbook is same with Orderbook
    return fetch(url).then(res => res.json());
  }

  stream$(pair: string): Observable<Orderbook> {
    const cached$ = this.cacheStreams.get(pair);
    if (cached$) {
      return cached$;
    }

    const orderbook$ = this.startOrderbook$(pair);
    this.cacheStreams.set(pair, orderbook$);

    return orderbook$;
  }

  stopOrderbook(pair: string): void {
    this.binanceWebsocket.unsubscribeChannel(getOrderbookChannel(pair));
    this.cacheStreams.delete(pair);
  }

  private update$(pair: string): Observable<Orderbook> {
    return this.binanceWebsocket.subscribeChannel<BinanceWsUpdateOrderbook>(getOrderbookChannel(pair))
      .pipe(map(adaptBinanceWsOrderbook));
  }

  private startOrderbook$(pair: string): Observable<Orderbook> {
    // orderbook fetched from rest api
    const fetchOrderbook$ = from(this.fetch(pair));
    // orderbook (diff) realtime stream
    const update$ = this.update$(pair);
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
