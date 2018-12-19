import { ReplaySubject, Observable } from 'rxjs';
import { ExchangeWebsocket } from '../../exchange-websocket.abstract';
import { wsEndpoint } from '../bitmex-common';
import { WebsocketRequest, WebsocketResponse, WebsocketData } from './types';

export class BitmexWebsocket extends ExchangeWebsocket<WebsocketRequest, WebsocketResponse | WebsocketData> {
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

  }

  onDestroy(): void {
    // TODO complete all streams
    // clear stream map and key map
    this.keyStreamMap.clear();
    this.chanIdKeyMap.clear();
  }
}
