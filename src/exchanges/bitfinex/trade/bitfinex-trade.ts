import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { fetchRxjs } from '../../../common';
import { Trade } from '../../exchange-types';

import { getTradesUrl, adaptBitfinexTrade } from './internal/functions';
import { BitfinexRawTrade } from './internal/types';

export class BitfinexTrade {
  // private pairStreamMap: { [pair: string]: Observable<Trade> } = {};
  private corsProxy = '';

  constructor(corsProxy?: string) {
    this.corsProxy = corsProxy;
  }

  // fetch trades
  fetchTrades$(pair: string, start: number, end: number, limit: number, sort: number): Observable<Trade[]> {
    const originUrl = getTradesUrl(pair, start, end, limit, sort);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    return fetchRxjs<BitfinexRawTrade[]>(url).pipe(
      map(trades => trades.map(adaptBitfinexTrade))
    );
  }
}
