import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

import { WebSocketRxJs } from '../../../common';
import { Ticker } from '../../exchange-types';
import { BinanceRawWsTicker, BinanceRawRestTicker } from './internal/types';
import { adaptBinanceWsTicker, adaptBinanceRestTicker, binanceTickerChannel, binanceTickerApiUrl } from './internal/functions';

export class BinanceTicker {
  private static readonly pairTickerMap = new Map<string, BinanceTicker>();

  static of(pair: string): BinanceTicker {
    const instance = BinanceTicker.pairTickerMap.get(pair) || new BinanceTicker(pair);
    BinanceTicker.pairTickerMap.set(pair, instance);

    return instance;
  }

  private stream$: Observable<Ticker> | undefined = undefined;
  private socket: WebSocketRxJs<BinanceRawWsTicker> | undefined = undefined;

  /**
   *
   * @param pair
   * @param createSocket
   */
  constructor(private pair: string, private createSocket: (pair: string) => WebSocketRxJs<BinanceRawWsTicker> = socketFactory) {}

  fetch$(corsProxy?: string): Observable<Ticker> {
    const originUrl = binanceTickerApiUrl(this.pair);
    const url = corsProxy ? `${corsProxy}${originUrl}` : originUrl;

    return ajax.getJSON<BinanceRawRestTicker>(url).pipe(map((binanceTicker) => adaptBinanceRestTicker(binanceTicker, this.pair)));
  }

  getStream$(): Observable<Ticker> {
    if (!this.stream$) {
      this.socket = this.createSocket(this.pair);
      this.stream$ = this.socket.message$.pipe(map((binanceTicker) => adaptBinanceWsTicker(binanceTicker, this.pair)));
    }

    return this.stream$;
  }

  stop(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = undefined;
    }

    if (this.stream$) {
      this.stream$ = undefined;
    }
  }
}

function socketFactory(pair: string): WebSocketRxJs<BinanceRawWsTicker> {
  const channel = binanceTickerChannel(pair);

  return new WebSocketRxJs<BinanceRawWsTicker>(channel);
}
