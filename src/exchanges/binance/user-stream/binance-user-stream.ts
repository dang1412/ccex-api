import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { WebSocketRxJs } from '../../../common';
import { wsEndpoint } from '../binance-common';
import { BinanceApiPrivate } from '../api-private/binance-api-private';
import { BinanceUserStreamAccount, BinanceUserStreamOrder } from './internal/types';

export class BinanceUserStream {
  private key: string;
  private corsProxy: string;
  private socket: WebSocketRxJs<BinanceUserStreamAccount | BinanceUserStreamOrder> | null = null;

  constructor(key: string, corsProxy?: string) {
    this.key = key;
    this.corsProxy = corsProxy || '';
  }

  userDataAccount$(): Observable<BinanceUserStreamAccount> {
    return this.userData$().pipe(filter(data => data.e === 'outboundAccountInfo'), map(data => <BinanceUserStreamAccount>data));
  }

  userDataOrder$(): Observable<BinanceUserStreamOrder> {
    return this.userData$().pipe(filter(data => data.e === 'executionReport'), map(data => <BinanceUserStreamOrder>data));
  }

  stopUserData() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  // TODO keep alive option
  private userData$(): Observable<BinanceUserStreamAccount | BinanceUserStreamOrder> {
    if (!this.socket) {
      // request for user data stream listen key
      const binanceApiPrivate = new BinanceApiPrivate(this.key, this.corsProxy);
      return binanceApiPrivate.getUserStreamListenKey$().pipe(
        switchMap((listenKey) => {
          const channel = wsEndpoint + listenKey;
          console.log('channel', channel);
          this.socket = new WebSocketRxJs<BinanceUserStreamAccount | BinanceUserStreamOrder>(channel);
          return this.socket.message$;
        })
      );
    }

    return this.socket.message$;
  }
}
