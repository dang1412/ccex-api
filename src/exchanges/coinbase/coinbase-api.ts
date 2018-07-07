import { Observable, empty } from 'rxjs';

import { ExchangeApi } from '../exchange-api.abstract';
import { ExchangeInfo, SupportFeatures, Ticker, Orderbook, Trade, CandleStick } from '../exchange-types';
import { CoinbaseWebsocket } from './coinbase-websocket';
import { CoinbaseTicker } from './ticker';
import { CoinbaseCandleStick } from './candlestick';
import { CoinbaseOrderbook } from './orderbook';
import { CoinbaseTrade } from './trade';

export class CoinbaseApi extends ExchangeApi {
  private coinbaseWebsocket: CoinbaseWebsocket;
  private coinbaseTicker: CoinbaseTicker;
  private coinbaseCandleStick: CoinbaseCandleStick;
  private coinbaseOrderbook: CoinbaseOrderbook;
  private coinbaseTrade: CoinbaseTrade;

  get exchangeInfo(): ExchangeInfo {
    return {
      name: 'coinbase',
      logoUrl: 'https://coinbase-logo.png',
      homepage: 'https://www.coinbase.com/',
      country: 'Coinbase country',
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

  constructor(corsProxy?: string) {
    super();
    this.coinbaseWebsocket = new CoinbaseWebsocket();
    this.coinbaseTicker = new CoinbaseTicker(corsProxy, this.coinbaseWebsocket);
    this.coinbaseCandleStick = new CoinbaseCandleStick(corsProxy);
    this.coinbaseOrderbook = new CoinbaseOrderbook(corsProxy, this.coinbaseWebsocket);
    this.coinbaseTrade = new CoinbaseTrade(corsProxy, this.coinbaseWebsocket);
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
    return this.coinbaseOrderbook.fetchOrderbook$(pair);
  }

  // realtime depth
  orderbook$(pair: string): Observable<Orderbook> {
    return this.coinbaseOrderbook.orderbook$(pair);
  }

  // stop realtime depth
  stopOrderbook(pair: string): void {
    this.coinbaseOrderbook.stopOrderbook(pair);
  }

  fetchTrades$(pair: string): Observable<Trade[]> {
    return this.coinbaseTrade.fetchTrades$(pair);
  }

  trade$(pair: string): Observable<Trade> {
    return this.coinbaseTrade.trade$(pair);
  }

  stopTrade(pair: string): void {
    this.coinbaseTrade.stopTrade(pair);
  }

  // request candlestick by time range and resolution
  fetchCandleStickRange$(pair: string, minutesFoot: number, start: number, end: number): Observable<CandleStick[]> {
    return this.coinbaseCandleStick.fetchCandleStickRange$(pair, minutesFoot, start, end);
  }
}
