import { Observable, ReplaySubject } from 'rxjs';

import { WebSocketRxJs } from '../../common/websocket-rxjs';
import { WebsocketSubscribeRequest, WebsocketSubscribeResponse, WebsocketMessageResponse } from './bitfinex-types';
import { wsEndpoint } from './bitfinex-common';

type WsResponse = WebsocketSubscribeResponse | WebsocketMessageResponse<any>;

export class BitfinexWebsocket {
  private ws: WebSocketRxJs<WsResponse>;
  private keyStreamMap: {[key: string]: ReplaySubject<any>} = {};
  private chanIdKeyMap: { [chanId: number]: string } = {};

  /**
   * 
   * @param subscribeRequest
   * { "event": "subscribe", "channel": "ticker", "symbol": "tEOSBTC" }
   * { "event": "subscribe", "channel": "candles", "key": "trade:1h:tEOSBTC" }
   */
  
  subscribe<T>(subscribeRequest: WebsocketSubscribeRequest): Observable<T> {
    if (!this.ws) {
      this.initWs();
    }

    const key = getKey(subscribeRequest);
    if (!this.keyStreamMap[key]) {
      this.keyStreamMap[key] = new ReplaySubject<T>(1);
      this.ws.send(JSON.stringify(subscribeRequest));
    }

    return this.keyStreamMap[key].asObservable();
  }

  unsubscribe(unsubscribeRequest: WebsocketSubscribeRequest): void {
    if (!this.ws) {
      return;
    }

    if (unsubscribeRequest.event !== 'unsubscribe') {
      throw new Error('in order to unsubscribe a channel, request event must be "unsubscribe"');
    }

    this.ws.send(JSON.stringify(unsubscribeRequest));
  }

  private initWs() {
    if (this.ws) {
      throw new Error('Bitfinex websocket is already initialized');
    }

    this.ws = new WebSocketRxJs<WsResponse>(wsEndpoint);
    this.ws.message$.subscribe((response: any) => {
      if (response.event === 'subscribed') {
        const subcribedResponse = <WebsocketSubscribeResponse>response;
        const key = getKey(subcribedResponse);
        this.chanIdKeyMap[subcribedResponse.chanId] = key;
      } else if (response.length === 2 && typeof response[0] === 'number' && response[1] !== 'hb') {
        const chanId = response[0];
        const key = this.chanIdKeyMap[chanId];
        const subject = this.keyStreamMap[key];
        subject.next(response[1]);
      }
    });
  }
}

function getKey(subscribeObject: WebsocketSubscribeRequest | WebsocketSubscribeResponse): string {
  return subscribeObject.channel + (subscribeObject.symbol || '') + (subscribeObject.key || '');
}
