import { Observable, empty } from 'rxjs';

import { ExchangeApi } from '../exchange-api.abstract';
import { ExchangeInfo, SupportFeatures, Ticker, Depth, CandleStick } from '../exchange.type';

import { CoincheckTicker } from './coincheck-ticker';

export class CoincheckApi extends ExchangeApi {
  private coincheckTicker: CoincheckTicker;

  get exchangeInfo(): ExchangeInfo {
    return {
      name: 'coincheck',
      logoUrl: 'https://coincheck-logo.png',
      homepage: 'https://www.coincheck.com/',
      country: 'Coincheck country'
    };
  }

  get marketNames(): string[] {
    return [];
  }

  get supportFeatures(): SupportFeatures {
    return {
      ticker: false,
      depth: false,
      chart: false
    };
  }

  constructor() {
    super();
    this.coincheckTicker = new CoincheckTicker();
  }

  // api request for ticker
  fetchTicker$(pair: string): Observable<Ticker> {
    return this.coincheckTicker.fetchTicker$(pair);
  }

  // realtime ticker
  ticker$(pair: string): Observable<Ticker> {
    return this.coincheckTicker.ticker$(pair);
  }

  // stop realtime ticker
  stopTicker(pair: string): void {
    this.coincheckTicker.stopTicker(pair);
  }

  // api request for depth
  fetchDepth$(pair: string): Observable<Depth> {
    return empty();
  }

  // realtime depth
  depth$(pair: string): Observable<Depth> {
    return empty();
  }

  // stop realtime depth
  stopDepth(pair: string): void {}

  // request candlestick by time range and resolution
  fetchCandleStickRange$(pair: string, minutesFoot: number, start: number, end: number): Observable<CandleStick[]> {
    return empty();
  }

  // realtime last candle
  lastCandle$(pair: string, minutesFoot: number): Observable<CandleStick> {
    return empty();
  }
}
