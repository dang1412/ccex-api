import { Observable, from } from 'rxjs';
import { getFetchFunction } from '../common/functions';

import { ExchangeInfo, SupportFeatures, Ticker, Depth, CandleStick } from './exchange.type';

const fetch = getFetchFunction();

export abstract class ExchangeApi {
  abstract get exchangeInfo(): ExchangeInfo;
  abstract get marketNames(): Observable<string[]>;
  abstract get supportFeatures(): SupportFeatures;
  // request ticker
  abstract fetchTicker$(pair: string): Observable<Ticker>;
  // realtime ticker
  abstract ticker$(pair: string): Observable<Ticker>;
  // stop realtime ticker
  abstract stopTicker(pair: string): void;
  // request depth
  abstract fetchDepth$(pair: string): Observable<Depth>;
  // realtime depth
  abstract depth$(pair: string): Observable<Depth>;
  // stop realtime depth
  abstract stopDepth(pair: string): void;
  // request candlestick
  abstract fetchCandleStickRange$(pair: string, minutesFoot: number, start: number, end: number): Observable<CandleStick[]>;
  // realtime last candlestick
  abstract lastCandle$(pair: string, minutesFoot: number): Observable<CandleStick>;

  fetch<T>(url: string): Observable<T> {
    return from(fetch(url).then(res => res.json()));
  }
}
