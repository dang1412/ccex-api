import { ExchangeWebsocket, SocketFactory } from '../../exchange-websocket.abstract';
import { ReplaySubject, Observable, of } from 'rxjs';
import { wsEndpoint } from '../bitfinex-common';
import { WebSocketRxJs } from '../../../common';
import { WebsocketMessageI, WebsocketRequestBaseI, WebsocketSubscribeI, WebsocketUnSubscribeI, WebsocketResponseI, WebsocketDataI } from './bitfinex-websocket.type';
import { mergeMap, filter, map, tap } from 'rxjs/operators';

// extends ExchangeWebsocket < WebsocketSubscribe | WebsocketUnSubscribe, WebsocketResponse | WebsocketData >
export class BitfinexWebsocket {
  private readonly keyChanIdMap = new Map<string, number>();
  private readonly ws: WebSocketRxJs<WebsocketMessageI>;

  private get subcribedResponse$(): Observable<WebsocketResponseI> {
    return this.ws.message$.pipe(filter((m: WebsocketResponseI) => m.event === 'subscribed'));
  }

  private get streamData$(): Observable<WebsocketDataI> {
    return this.ws.message$.pipe(filter((m: WebsocketDataI) => m.length >= 2 && typeof m[0] === 'number' && m[1] !== 'hb'));
  }

  constructor(endPointOrWs?: string | WebSocketRxJs) {
    this.ws = endPointOrWs === undefined ? new WebSocketRxJs(wsEndpoint)
      : typeof endPointOrWs === 'string' ? new WebSocketRxJs(endPointOrWs)
      : endPointOrWs;
  }

  subscribeChannel<T>(request: WebsocketRequestBaseI): Observable<T> {
    const key = getKey(request);

    // get chanId and cache
    const knownChanId = this.keyChanIdMap.get(key);
    const chanId$ = knownChanId ? of(knownChanId) : this.getUpcomingChanId$(key);

    // send request for the first time
    if (!knownChanId) {
      this.send({ ...request, event: 'subscribe' });
    }

    return chanId$.pipe(
      // cache key => chanId
      tap(chanId => this.keyChanIdMap.set(key, chanId)),
      mergeMap(chanId => this.getChanIdData$<T>(chanId)),
    );
  }

  unsubscribeChannel(request: WebsocketRequestBaseI): boolean {
    const key = getKey(request);
    const chanId = this.keyChanIdMap.get(key);
    if (chanId) {
      this.keyChanIdMap.delete(key);
      this.send({ chanId, event: 'unsubscribe' });
    }

    return chanId ? true : false;
  }

  destroy(): void {
    this.ws.close();
  }

  private getUpcomingChanId$(key: string): Observable<number> {
    return this.subcribedResponse$.pipe(
      filter(res => getKey(res) === key),
      map(res => res.chanId),
    );
  }

  private getChanIdData$<T>(chanId: number): Observable<T> {
    return this.streamData$.pipe(
      filter(m => m[0] === chanId),
      map(m => m[1] === 'te' || m[1] === 'tu' ? m[2] : m[1]),
    )
  }

  private send(req: WebsocketSubscribeI | WebsocketUnSubscribeI): void {
    this.ws.send(JSON.stringify(req));
  }
}

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
