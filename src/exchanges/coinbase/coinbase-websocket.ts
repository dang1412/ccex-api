import { WebSocketRxJs } from '../../common/websocket-rxjs';
import { WebsocketSubscribeRequest, WebsocketUnSubscribeRequest, WebsocketRequest, WebsocketMessageResponse } from './coinbase-types';
import { Observable, ReplaySubject } from 'rxjs';

export class CoinbaseWebsocket {
  private ws: WebSocketRxJs<WebsocketMessageResponse>;
  private url: string;
  private keyStreamMap: {[key: string]: ReplaySubject<any>} = {};

  constructor(url: string) {
    this.url = url;
  }

  /**
   * @param subscribeRequest
   * {"type":"subscribe","product_ids":["BTC-USD"],"channels":["ticker"]}
   */
  subscribe<T>(subscribeRequest: WebsocketSubscribeRequest): Observable<T> {
    if (!this.ws) {
      this.initWs();
    }

    const key = getKeyFromRequest(subscribeRequest);
    if (!this.keyStreamMap[key]) {
      this.keyStreamMap[key] = new ReplaySubject<T>(1);
      this.ws.send(JSON.stringify(subscribeRequest));
    }

    return this.keyStreamMap[key].asObservable();
  }

  /**
   * 
   * @param unsubscribeRequest
   * {"type":"unsubscribe","product_ids":["BTC-USD"],"channels":["ticker"]}
   */
  unsubscribe(unsubscribeRequest: WebsocketUnSubscribeRequest): void{
    if (!this.ws) {
      return;
    }

    this.ws.send(JSON.stringify(unsubscribeRequest));
    const key = getKeyFromRequest(unsubscribeRequest);
    delete this.keyStreamMap[key];
  }

  private initWs() {
    if (this.ws) {
      throw new Error('Coinbase websocket is already initialized');
    }

    this.ws = new WebSocketRxJs(this.url);
    this.ws.message$.subscribe((response: any) => {
      if (response.type && response.product_id) {
        const messageResponse = <WebsocketMessageResponse>response;
        const key = getKeyFromResponse(messageResponse);
        if (this.keyStreamMap[key]) {
          this.keyStreamMap[key].next(messageResponse);
        }
      }
    });
  }
}

function getKeyFromRequest(request: WebsocketRequest): string {
  return request.channels[0] + request.product_ids[0];
}

function getKeyFromResponse(response: WebsocketMessageResponse): string {
  return response.type + response.product_id;
}
