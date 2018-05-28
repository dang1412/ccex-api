import { Observable, of, empty } from 'rxjs';
import { map, concat } from 'rxjs/operators';

import { rxjsFetch } from '../../common';
import { ExchangeApi } from '../exchange-api.abstract';
import { ExchangeInfo, SupportFeatures, Ticker, Depth, CandleStick } from '../exchange.type';

export class BinanceApi extends ExchangeApi {
  get exchangeInfo(): ExchangeInfo {
    return {
      name: 'binance',
      logoUrl: 'https://www.binance.com/resources/img/logo-en.svg',
      homepage: 'https://www.binance.com/?ref=16635017',
      country: 'cn'
    };
  }

  get marketNames(): Observable<string[]> {
    return of([
      'btc_usd',
      'eos_btc',
      'eth_btc',
      'ltc_btc',
      'bcc_btc',
    ]);
  }

  get supportFeatures(): SupportFeatures {
    return {
      ticker: true,
      depth: true,
      chart: true
    };
  }

  ticker$(pair: string): Observable<Ticker> {
    return empty();
  }

  fetchTicker$(pair: string): Observable<Ticker> {
    return empty();
  }

  stopTicker(pair: string): void {

  }

  fetchDepth$(pair: string): Observable<Depth> {
    return empty();
  }

  depth$(pair: string): Observable<Depth> {
    return empty();
  }

  stopDepth(pair: string): void {

  }

  fetchCandleStickRange$(pair: string, minutesFoot: number, start: number, end: number): Observable<CandleStick[]> {
    return empty();
  }

  lastCandle$(pair: string, minutesFoot: number): Observable<CandleStick> {
    return empty();
  }
}
