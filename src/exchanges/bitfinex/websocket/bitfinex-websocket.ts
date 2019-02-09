import { ExchangeWebsocket, SocketFactory } from '../../exchange-websocket.abstract';
import { ReplaySubject, Observable } from 'rxjs';
import { wsEndpoint } from '../bitfinex-common';

export class BitfinexWebsocket extends ExchangeWebsocket<WebsocketSubscribe | WebsocketUnSubscribe, WebsocketResponse | WebsocketData> {
  private readonly keyStreamMap = new Map<string, ReplaySubject<any>>();
  private readonly chanIdKeyMap = new Map<number, string>();

  constructor(endPoint?: string, createSocket?: SocketFactory) {
    super(endPoint || wsEndpoint, createSocket);
  }

  /**
   * Subscribe channel
   *
   * @param request
   */
  subscribe<T>(request: WebsocketRequestBase): Observable<T> {
    const key = getKey(request);
    let stream = this.keyStreamMap.get(key);

    if (!stream) {
      stream = new ReplaySubject<T>(1);
      this.keyStreamMap.set(key, stream);
    }

    this.send({ ...request, event: 'subscribe' });

    return stream.asObservable();
  }

  /**
   * Unsubscribe channel
   *
   * @param request
   */
  unsubscribe(request: WebsocketRequestBase): void {
    const key = getKey(request);
    const stream = this.keyStreamMap.get(key);
    if (stream) {
      stream.complete();
      this.keyStreamMap.delete(key);
    }

    const chanId = Array.from(this.chanIdKeyMap.keys()).find(cid => this.chanIdKeyMap.get(cid) === key);
    if (chanId) {
      this.chanIdKeyMap.delete(chanId);
      this.send({ event: 'unsubscribe', chanId });
    }

    // TODO handle when unsubscribe complete
  }

  /**
   * handle message
   *
   * @param message
   */
  handleMessage(message: WebsocketResponse | WebsocketData): void {
    // console.log('handleMessage ===>', message);
    const response = message as WebsocketResponse;
    if (response.event === 'subscribed') {
      // save chanId => key, no need to forward message to stream
      const key = getKey(response);
      this.chanIdKeyMap.set(response.chanId, key);

      return;
    }

    if (response.event === 'unsubscribed') {
      // handle unsubcribe success
      // console.log('unsubscribed', response);
      return;
    }

    const messageData = message as WebsocketData;
    if (messageData.length >= 2 && typeof messageData[0] === 'number' && messageData[1] !== 'hb') {
      const chanId = messageData[0];
      const key = this.chanIdKeyMap.get(chanId);
      if (key) {
        const stream = this.keyStreamMap.get(key);

        // normally data is messageData[1], special 'trade' channel case: message is messageData[2]
        const data = messageData[1] === 'tu' || messageData[1] === 'te' ? messageData[2] : messageData[1];
        if (stream) {
          stream.next(data);
        }
      }
    }
  }

  onDestroy(): void {
    // TODO complete all streams
    // clear stream map and key map
    this.keyStreamMap.clear();
    this.chanIdKeyMap.clear();
  }
}

export function getKey(request: WebsocketRequestBase): string {
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

export interface WebsocketRequestBase {
  channel: string;

  // ex: tBTCUSD (ticker, orderbook)
  symbol?: string;

  // (orderbook)
  // level of price aggregation (P0, P1, P2, P3)
  // default: P0
  prec?: string;

  // (orderbook)
  // Frequency of updates(F0, F1).
  // F0 = realtime / F1=2sec.
  freq?: string;

  // (orderbook)
  len?: string;

  // (candles)
  key?: string;
}

export interface WebsocketSubscribe extends WebsocketRequestBase {
  event: 'subscribe';
}

export interface WebsocketUnSubscribe {
  event: 'unsubscribe';
  chanId: number;
}

export interface WebsocketResponse extends WebsocketRequestBase {
  event: 'subscribed' | 'unsubscribed';
  chanId: number;
  // ex: BTCUSD
  pair?: string;
}

export type WebsocketData = [number, any] | [number, string, any];
