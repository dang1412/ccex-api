import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { WebSocketRxJs } from '../../common/websocket-rxjs';
import { Ticker } from '../exchange.type';
import { BinanceTickerI } from './binance-types';
import { adaptBinanceTicker, binanceTickerChannel } from './binance-functions';

export class BinanceTicker {
  private pairTickerSocketMap: { [pair: string]: Observable<Ticker> } = {};
  constructor() {}

  ticker$(pair: string): Observable<Ticker> {
    if (!this.pairTickerSocketMap[pair]) {
      const channel = binanceTickerChannel(pair);
      const ws = new WebSocketRxJs<BinanceTickerI>(channel);
      this.pairTickerSocketMap[pair] = ws.message$.pipe(map(binanceTicker => adaptBinanceTicker(binanceTicker, pair)));
    }

    return this.pairTickerSocketMap[pair];
  }
}
