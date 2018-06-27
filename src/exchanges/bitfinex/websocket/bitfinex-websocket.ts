import { Observable, ReplaySubject } from 'rxjs';

import { WebSocketRxJs } from '../../../common/websocket-rxjs';
import { WebsocketSubOrUnSubRequest, WebsocketRequestResponse, WebsocketMessageResponse } from '../bitfinex-common.types';
import { getKey, wsEndpoint } from '../bitfinex-common';

type WsResponse = WebsocketRequestResponse | WebsocketMessageResponse<any>;

export class BitfinexWebsocket {
  private ws: WebSocketRxJs<WsResponse>;
  private keyStreamMap: {[key: string]: ReplaySubject<any>} = {};
  private chanIdKeyMap: { [chanId: number]: string } = {};
  private unsubscribeSuccess$ = new ReplaySubject<string>(1);

  /**
   * 
   * @param subscribeRequest
   * { "event": "subscribe", "channel": "ticker", "symbol": "tEOSBTC" }
   * { "event": "subscribe", "channel": "candles", "key": "trade:1h:tEOSBTC" }
   */
  subscribe<T>(subscribeRequest: WebsocketSubOrUnSubRequest): Observable<T> {
    if (!this.ws) {
      this.initWebsocket();
    }

    // map each subscribe channel to an unique key
    // use key to store corresponding stream
    const key = getKey(subscribeRequest);
    if (!this.keyStreamMap[key]) {
      // prepare subject
      this.keyStreamMap[key] = new ReplaySubject<T>(1);
      // send subscribe request
      this.ws.send(JSON.stringify(subscribeRequest));
    }

    // return subject's stream
    return this.keyStreamMap[key].asObservable();
  }

  /**
   * 
   * @param unsubscribeRequest 
   */
  unsubscribe(unsubscribeRequest: WebsocketSubOrUnSubRequest): void {
    if (!this.ws) {
      return;
    }

    // get key from unsubscribe request
    const key = getKey(unsubscribeRequest);

    // complete and delete subject
    const subject = this.keyStreamMap[key];
    if (subject) {
      subject.complete();
      delete this.keyStreamMap[key];
    }

    // get chanId from key and delete keyMap
    const chanId = getKeyByValue(this.chanIdKeyMap, key);
    if (chanId) {
      delete this.chanIdKeyMap[chanId];
    }

    // send unsubscribe request using chanId
    this.ws.send(JSON.stringify({
      event: 'unsubscribe',
      chanId
    }));
  }

  destroy(): void {
    this.ws.close();
    this.ws = null;

    // TODO complete and delete all subject
  }

  /**
   * 
   */
  private initWebsocket() {
    if (this.ws) {
      throw new Error('Bitfinex websocket is already initialized');
    }

    this.ws = new WebSocketRxJs<WsResponse>(wsEndpoint);
    this.ws.message$.subscribe((response: any) => {
      if (response.event === 'subscribed') {
        // subscribe response success
        const subcribedResponse = <WebsocketRequestResponse>response;
        const key = getKey(subcribedResponse);
        // map chanId => key
        this.chanIdKeyMap[subcribedResponse.chanId] = key;
      } else if (response.event === 'unsubscribed') {
        // unsubscribe success
        const chanId = response.chanId;
        const key = this.chanIdKeyMap[chanId];
        this.unsubscribeSuccess$.next(key);
      } else if (response.length === 2 && typeof response[0] === 'number' && response[1] && response[1] !== 'hb') {
        // subscribed channel's message
        const chanId = response[0];
        const key = this.chanIdKeyMap[chanId];
        const subject = this.keyStreamMap[key];
        if (subject) {
          subject.next(response[1]);
        }
      }
    });
  }
}

function getKeyByValue(object: {[key: number]: string}, value: string): number {
  return +Object.keys(object).find(key => object[key] === value);
}
