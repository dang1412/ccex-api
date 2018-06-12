import { Observable, empty } from 'rxjs';

import { ExchangeApi } from '../exchange-api.abstract';
import { ExchangeInfo, SupportFeatures, Ticker, Orderbook, Trade, CandleStick } from '../exchange-types';
import { CoincheckTicker } from './ticker/coincheck-ticker';

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

  get markets(): string[] {
    return ['btc_jpy'];
  }

  get testMarkets(): string[] {
    return ['btc_jpy'];
  }

  get supportFeatures(): SupportFeatures {
    return {
      ticker: false,
      orderbook: false,
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
