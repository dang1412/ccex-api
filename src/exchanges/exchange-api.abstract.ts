import { Observable } from 'rxjs';
import { ExchangeInfo, SupportFeatures, Ticker, Depth, CandleStick } from './exchange.type';

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
}
