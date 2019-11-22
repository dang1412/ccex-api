import { Observable } from 'rxjs';
import { wsEndpoint } from '../bitfinex-common';
import { WebSocketRxJs } from '../../../common';
import {
  WebsocketMessageI,
  WebsocketRequestBaseI,
  WebsocketSubscribeI,
  WebsocketUnSubscribeI,
  WebsocketResponseI,
  WebsocketDataI,
} from './bitfinex-websocket.type';
import { filter, map, switchMap, take, takeUntil, mapTo } from 'rxjs/operators';

export class BitfinexWebsocket {
  private ws: WebSocketRxJs<WebsocketMessageI> | null = null;
  private readonly cache = new Map<string, [Observable<any>, Promise<number>]>();

  constructor(private readonly endPointOrWs?: string | WebSocketRxJs) { }

  subscribeChannel<T>(request: WebsocketRequestBaseI): Observable<T> {
    if (!this.ws) {
      this.ws = typeof this.endPointOrWs === 'object' ? this.endPointOrWs : new WebSocketRxJs(this.endPointOrWs || wsEndpoint);
    }

    const message$ = this.ws.message$;
    const key = getKey(request);
    const cached = this.cache.get(key);

    // stream created
    if (cached) {
      return cached[0];
    }

    // create stream
    this.send({ ...request, event: 'subscribe' });

    // chanId stream (once and complete)
    const chanId$ = getChanId$(message$, key);

    // unsubscribe stream
    const unsub$ = chanId$.pipe(
      switchMap(chanId => getUnsub$(message$, chanId)),
    );

    // data stream
    const data$ = chanId$.pipe(
      switchMap(chanId => getChanData$<T>(message$, chanId)),
      takeUntil(unsub$),
    );

    // cache stream
    this.cache.set(key, [data$, chanId$.toPromise()]);

    return data$;
  }

  async unsubscribeChannel(req: WebsocketRequestBaseI): Promise<void> {
    if (!this.ws) {
      return;
    }

    const key = getKey(req);
    const cache = this.cache.get(key);
    if (!cache) {
      return;
    }

    // send unsubcribe request
    const chanId = await cache[1];
    this.send({ event: 'unsubscribe', chanId });

    // wait until unsubcribe sucess
    await getUnsub$(this.ws.message$, chanId).toPromise();
    this.cache.delete(key);
  }

  destroy(): void {
    if (this.ws) {
      this.ws.close();
    }
  }

  private send(req: WebsocketSubscribeI | WebsocketUnSubscribeI): void {
    if (this.ws) {
      this.ws.send(JSON.stringify(req));
    }
  }
}

// get chanId stream
function getChanId$(message$: Observable<WebsocketMessageI>, key: string): Observable<number> {
  return message$.pipe(
    map(m => m as WebsocketResponseI),  // work arround to cast type
    filter((m) => m.event === 'subscribed'),
    filter((m) => getKey(m) === key),
    map((m) => m.chanId),
    take(1),
  );
}

// get chanData stream
function getChanData$<T>(message$: Observable<WebsocketMessageI>, chanId: number): Observable<T> {
  return message$.pipe(
    map(m => m as WebsocketDataI),  // work arround to cast type
    filter((m) => m.length >= 2 && m[0] === chanId && m[1] !== 'hb'),
    map((m) => (m[1] === 'te' || m[1] === 'tu' ? m[2] : m[1])),
  );
}

// unsubcribe stream
function getUnsub$(message$: Observable<WebsocketMessageI>, chanId: number): Observable<number> {
  return message$.pipe(
    map(m => m as WebsocketResponseI),  // work arround to cast type
    filter((m) => m.event === 'unsubscribed' && m.chanId === chanId),
    mapTo(chanId),
    take(1),
  );
}

/**
 * Get key from request and from subcribe response
 * @param request
 */
export function getKey(request: WebsocketRequestBaseI): string {
  return (
    request.channel +
    // (ticker, orderbook)
    (request.symbol || '') +
    // (orderbook)
    (request.prec || '') +
    (request.freq || '') +
    (request.len || '') +
    // (candle)
    (request.key || '')
  );
}
