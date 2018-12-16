import { ExchangeWebsocket } from '../../exchange-websocket.abstract';
import { ReplaySubject, Observable } from 'rxjs';
import { wsEndpoint } from '../bitfinex-common';

export class BitfinexWebsocket extends ExchangeWebsocket<WebsocketRequest, WebsocketResponse | WebsocketData> {
  private readonly keyStreamMap = new Map<string, ReplaySubject<any>>();
  private readonly chanIdKeyMap = new Map<number, string>();

  constructor(endPoint?: string) {
    super(endPoint || wsEndpoint);
  }

  /**
   * handle message
   *
   * @param message
   */
  handleMessage(message: WebsocketResponse | WebsocketData): void {
    const response = message as WebsocketResponse;
    if (response.event === 'subscribed') {
      // save chanId => key, no need to forward message to stream
      const key = getKey(response);
      this.chanIdKeyMap.set(response.chanId, key);

      return;
    }

    if (response.event === 'unsubscribed') {
      // handle unsubcribe success
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
          console.log('data ===========>', data);
          stream.next(data);
        }
      }
    }
  }

  onDestroy(): void {
    // complete and delete all streams
    // clear stream map and key map
  }

  /**
   * Subscribe or unsubscribe channel
   *
   * @param request
   */
  sendRequest<T>(request: WebsocketRequest): Observable<T> {
    const key = getKey(request);

    let stream = this.keyStreamMap.get(key);
    if (!stream) {
      stream = new ReplaySubject<T>(1);
      this.keyStreamMap.set(key, stream);
    }

    this.send(request);

    // complete stream if unsubscribe
    if (request.event === 'unsubscribe') {
      stream.complete();
    }

    return stream.asObservable();
  }
}

export function getKey(request: WebsocketRequestOrResponse): string {
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

export interface WebsocketRequestOrResponse {
  channel: string;

  // ex: BTCUSD (ticker, orderbook)
  symbol: string;

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

export interface WebsocketRequest extends WebsocketRequestOrResponse {
  event: 'subscribe' | 'unsubscribe';
}

export interface WebsocketResponse extends WebsocketRequestOrResponse {
  event: 'subscribed' | 'unsubscribed';
  chanId: number;
  // ex: BTCUSD
  pair?: string;
}

export type WebsocketData = [number, any] | [number, string, any];
