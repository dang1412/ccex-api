import { Observable, empty } from 'rxjs';

import { ExchangeApi } from '../exchange-api.abstract';
import { ExchangeInfo, SupportFeatures, Ticker, Orderbook, Trade, CandleStick } from '../exchange-types';
import { wsEndpoint } from './coinbase-functions';
import { CoinbaseWebsocket } from './coinbase-websocket';
import { CoinbaseTicker } from './ticker/coinbase-ticker';

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

  get markets(): string[] {
    return [];
  }

  get testMarkets(): string[] {
    return [];
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
    const coinbaseWs = new CoinbaseWebsocket(wsEndpoint);
    this.coinbaseTicker = new CoinbaseTicker(coinbaseWs);
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
