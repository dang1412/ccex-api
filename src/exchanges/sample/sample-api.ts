import { Observable, empty } from 'rxjs';

import { ExchangeApi } from '../exchange-api.abstract';
import { ExchangeInfo, SupportFeatures, Ticker, Orderbook, Trade, CandleStick } from '../exchange-types';

import { SampleTicker } from './ticker/sample-ticker';

export class SampleApi extends ExchangeApi {
  private sampleTicker: SampleTicker;

  get exchangeInfo(): ExchangeInfo {
    return {
      name: 'sample',
      logoUrl: 'https://sample-logo.png',
      homepage: 'https://www.sample.com/',
      country: 'Sample country',
    };
  }

  get markets(): string[] {
    return [];
  }

  get representativeMarkets(): string[] {
    return [];
  }

  get supportFeatures(): SupportFeatures {
    return {
      ticker: false,
      orderbook: false,
      chart: false,
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
  fetchOrderbook$(pair: string): Observable<Orderbook> {
    return empty();
  }

  // realtime depth
  orderbook$(pair: string): Observable<Orderbook> {
    return empty();
  }

  // stop realtime depth
  stopOrderbook(pair: string): void {}

  fetchTrades$(pair: string): Observable<Trade[]> {
    return empty();
  }

  trade$(pair: string): Observable<Trade> {
    return empty();
  }

  stopTrade(pair: string): void {}

  // request candlestick by time range and resolution
  fetchCandleStickRange$(pair: string, minutesFoot: number, start: number, end: number): Observable<CandleStick[]> {
    return empty();
  }
}
