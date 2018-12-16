import { WebSocketRxJs } from '../common/websocket-rxjs';

/**
 * Abstract class for websocket api
 *
 * @param T: ws send request type
 * @param U: raw ws response type
 */
export abstract class ExchangeWebsocket<T = any, U = any> {
  private ws: WebSocketRxJs<U> | null = null;
  constructor(private readonly endPoint: string) { }

  abstract handleMessage(response: U): void;
  abstract onDestroy(): void;

  send(request: T): void {
    if (!this.ws) {
      this.initWebsocket();
    }

    if (this.ws) {
      this.ws.send(JSON.stringify(request));
    }
  }

  destroy(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.onDestroy();
  }

  private initWebsocket(): void {
    if (this.ws) {
      throw new Error('websocket is already initialized');
    }

    this.ws = new WebSocketRxJs<U>(this.endPoint);
    this.ws.message$.subscribe((response) => {
      this.handleMessage(response);
    });
  }
}
