import fetch from 'node-fetch';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Trade } from '../../exchange-types';
import { BinanceRestTrade, BinanceWsTrade } from './internal/types';
import { adaptBinanceRestTrade, adaptBinanceWsTrade, binanceTradeApiUrl, getTradeChannel } from './internal/functions';
import { BinanceWebsocket } from '../websocket';

export class BinanceTrade {
  constructor(private readonly binanceWebsocket: BinanceWebsocket, private readonly corsProxy: string = '') {}

  // fetch trades
  async fetch(pair: string, limit: number = 100): Promise<Trade[]> {
    const originUrl = binanceTradeApiUrl(pair, limit);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    const rawTrades: BinanceRestTrade[] = await fetch(url).then(res => res.json());

    return rawTrades.map(adaptBinanceRestTrade);
  }

  // realtime trade
  stream$(pair: string): Observable<Trade> {
    const channel = getTradeChannel(pair);

    return this.binanceWebsocket.subscribeChannel<BinanceWsTrade>(channel).pipe(
      map(adaptBinanceWsTrade),
    );
  }

  // stop realtime trade
  stop(pair: string): void {
    const channel = getTradeChannel(pair);
    this.binanceWebsocket.unsubscribeChannel(channel);
  }
}
