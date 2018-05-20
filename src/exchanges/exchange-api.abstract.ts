import { Observable, from } from 'rxjs';
import { getFetchFunction } from '../common/functions';

import { ExchangeInfo, SupportFeatures, Ticker, Depth, CandleStick } from './exchange.type';

const fetch = getFetchFunction();

export abstract class ExchangeApi {
  abstract get exchangeInfo(): ExchangeInfo;
  abstract get marketNames(): Observable<string[]>;
  abstract get supportFeatures(): SupportFeatures;
  abstract getTicker$(pair: string): Observable<Ticker>;
  abstract stopTicker(pair: string): void;
  abstract getDepth$(pair: string): Observable<Depth>;
  abstract stopDepth(pair: string): void;
  abstract getCandleStickRange$(pair: string, minutesFoot: number, start: number, end: number): Observable<CandleStick[]>;
  abstract getLastCandle$(pair: string, minutesFoot: number): Observable<CandleStick>;

  fetch<T>(url: string): Observable<T> {
    return from(fetch(url).then(res => res.json()));
  }
}
