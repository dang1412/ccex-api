import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WebSocketRxJs, fetchRxjs } from '../../../common';

import { Trade } from '../../exchange-types';
import { BinanceRawRestTrade, BinanceRawWsTrade } from './internal/types';
import { adaptBinanceRestTrade, adaptBinanceWsTrade, binanceTradeApiUrl, binanceTradeChannel } from './internal/functions';

export class BinanceTrade {
  private readonly pairStreamMap: { [pair: string]: Observable<Trade> } = {};
  private readonly pairSocketMap: { [pair: string]: WebSocketRxJs } = {};
  private readonly corsProxy: string;

  constructor(corsProxy: string = '') {
    this.corsProxy = corsProxy;
  }

  // fetch trades
  fetchTrades$(pair: string, limit: number = 100): Observable<Trade[]> {
    const originUrl = binanceTradeApiUrl(pair, limit);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    return fetchRxjs<BinanceRawRestTrade[]>(url).pipe(map((trades) => trades.map(adaptBinanceRestTrade)));
  }

  // realtime trade
  trade$(pair: string): Observable<Trade> {
    if (!this.pairStreamMap[pair]) {
      this.pairStreamMap[pair] = this.startTrade$(pair);
    }

    return this.pairStreamMap[pair];
  }

  // stop realtime trade
  stopTrade(pair: string): void {
    if (this.pairSocketMap[pair]) {
      this.pairSocketMap[pair].close();
      delete this.pairSocketMap[pair];
    }

    if (this.pairStreamMap[pair]) {
      delete this.pairStreamMap[pair];
    }
  }

  // start trade websocket stream
  private startTrade$(pair: string): Observable<Trade> {
    const channel = binanceTradeChannel(pair);
    const ws = new WebSocketRxJs<BinanceRawWsTrade>(channel);
    this.pairSocketMap[pair] = ws;

    return ws.message$.pipe(map(adaptBinanceWsTrade));
  }
}
