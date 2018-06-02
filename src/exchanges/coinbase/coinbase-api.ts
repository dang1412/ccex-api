import { Observable, empty } from 'rxjs';

import { ExchangeApi } from '../exchange-api.abstract';
import { ExchangeInfo, SupportFeatures, Ticker, Depth, CandleStick } from '../exchange.type';

import { CoinbaseTicker } from './coinbase-ticker';

export class CoinbaseApi extends ExchangeApi {
  private coinbaseTicker: CoinbaseTicker;

  get exchangeInfo(): ExchangeInfo {
    return {
      name: 'coinbase',
      logoUrl: 'https://coinbase-logo.png',
      homepage: 'https://www.coinbase.com/',
      country: 'Coinbase country'
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
    this.coinbaseTicker = new CoinbaseTicker();
  }

  // api request for ticker
  fetchTicker$(pair: string): Observable<Ticker> {
    return this.coinbaseTicker.fetchTicker$(pair);
  }

  // realtime ticker
  ticker$(pair: string): Observable<Ticker> {
    return this.coinbaseTicker.ticker$(pair);
  }

  // stop realtime ticker
  stopTicker(pair: string): void {
    this.coinbaseTicker.stopTicker(pair);
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
