import { Observable, empty } from 'rxjs';

import { ExchangeApi } from '../exchange-api.abstract';
import { ExchangeInfo, SupportFeatures, Ticker, Depth, CandleStick } from '../exchange.type';

import { SampleTicker } from './sample-ticker';

export class SampleApi extends ExchangeApi {
  private sampleTicker: SampleTicker;

  get exchangeInfo(): ExchangeInfo {
    return {
      name: 'sample',
      logoUrl: 'https://sample-logo.png',
      homepage: 'https://www.sample.com/',
      country: 'Sample country'
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
    this.sampleTicker = new SampleTicker();
  }

  // api request for ticker
  fetchTicker$(pair: string): Observable<Ticker> {
    return this.sampleTicker.fetchTicker$(pair);
  }

  // realtime ticker
  ticker$(pair: string): Observable<Ticker> {
    return this.sampleTicker.ticker$(pair);
  }

  // stop realtime ticker
  stopTicker(pair: string): void {
    this.sampleTicker.stopTicker(pair);
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
