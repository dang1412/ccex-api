import { Observable, empty } from 'rxjs';

import { ExchangeApi } from '../exchange-api.abstract';
import { ExchangeInfo, SupportFeatures, Ticker, Orderbook, Trade, CandleStick } from '../exchange-types';
import { BitmexTicker } from './ticker/bitmex-ticker';

export class BitmexApi extends ExchangeApi {
  private bitmexTicker: BitmexTicker;

  get exchangeInfo(): ExchangeInfo {
    return {
      name: 'coincheck',
      logoUrl: 'https://coincheck-logo.png',
      homepage: 'https://www.coincheck.com/',
      country: 'Coincheck country',
    };
  }

  get markets(): string[] {
    return ['btc_jpy'];
  }

  get representativeMarkets(): string[] {
    return ['btc_jpy'];
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
    this.bitmexTicker = new BitmexTicker();
  }

  // api request for ticker
  fetchTicker$(pair: string): Observable<Ticker> {
    return this.bitmexTicker.fetchTicker$(pair);
  }

  // realtime ticker
  ticker$(pair: string): Observable<Ticker> {
    return this.bitmexTicker.ticker$(pair);
  }

  // stop realtime ticker
  stopTicker(pair: string): void {
    this.bitmexTicker.stopTicker(pair);
  }

  // api request for depth
  fetchOrderbook$(pair: string): Observable<Orderbook> {
    return empty();
  }

  // realtime depth
  orderbook$(pair: string): Observable<Orderbook> {
    return empty();
  }

  // stop realtime orderbook
  stopOrderbook(pair: string): void {
    // implement
  }

  fetchTrades$(pair: string): Observable<Trade[]> {
    return empty();
  }

  trade$(pair: string): Observable<Trade> {
    return empty();
  }

  // stop realtime trade
  stopTrade(pair: string): void {
    // implement
  }

  // request candlestick by time range and resolution
  fetchCandleStickRange$(pair: string, minutesFoot: number, start: number, end: number): Observable<CandleStick[]> {
    return empty();
  }
}
