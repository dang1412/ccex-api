import { Observable } from 'rxjs';
import { ExchangeInfo, SupportFeatures, Ticker, Orderbook, CandleStick } from './exchange-types';

export abstract class ExchangeApi {
  abstract get exchangeInfo(): ExchangeInfo;
  abstract get markets(): string[];
  abstract get testMarkets(): string[];
  abstract get supportFeatures(): SupportFeatures;
  // request ticker
  abstract fetchTicker$(pair: string): Observable<Ticker>;
  // realtime ticker
  abstract ticker$(pair: string): Observable<Ticker>;
  // stop realtime ticker
  abstract stopTicker(pair: string): void;
  // request orderbook
  abstract fetchOrderbook$(pair: string): Observable<Orderbook>;
  // realtime orderbook
  abstract orderbook$(pair: string): Observable<Orderbook>;
  // stop realtime orderbook
  abstract stopOrderbook(pair: string): void;
  // request candlestick
  abstract fetchCandleStickRange$(pair: string, minutesFoot: number, start: number, end: number): Observable<CandleStick[]>;
  // realtime last candlestick (used for tradingview datafeed)
  abstract lastCandle$(pair: string, minutesFoot: number): Observable<CandleStick>;
}
