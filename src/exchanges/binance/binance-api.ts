import { Observable, empty } from 'rxjs';

import { ExchangeApi } from '../exchange-api.abstract';
import { ExchangeInfo, SupportFeatures, Ticker, Orderbook, Trade, CandleStick } from '../exchange-types';
import { BinanceTicker } from './ticker/binance-ticker';

const defaultOptions = {
  apiKey: '',
  apiSecret: '',
  corsProxy: '',
};

export class BinanceApi extends ExchangeApi {
  private binanceTicker: BinanceTicker;

  get exchangeInfo(): ExchangeInfo {
    return {
      name: 'binance',
      logoUrl: 'https://www.binance.com/resources/img/logo-en.svg',
      homepage: 'https://www.binance.com/?ref=16635017',
      country: 'cn'
    };
  }

  get markets(): string[] {
    return [
      'btc_usdt',
      'eos_btc',
      'eth_btc',
      'ltc_btc',
      'bcc_btc',
    ];
  }

  get testMarkets(): string[] {
    return [
      'btc_usdt',
      'eos_btc',
      'eth_btc',
    ];
  }
  get supportFeatures(): SupportFeatures {
    return {
      ticker: true,
      orderbook: true,
      chart: true
    };
  }

  constructor() {
    super();
    this.binanceTicker = new BinanceTicker();
  }

  fetchTicker$(pair: string): Observable<Ticker> {
    return this.binanceTicker.fetchTicker$(pair);
  }

  ticker$(pair: string): Observable<Ticker> {
    return this.binanceTicker.ticker$(pair);
  }

  stopTicker(pair: string): void {
    this.binanceTicker.stopTicker(pair);
  }

  fetchOrderbook$(pair: string): Observable<Orderbook> {
    return empty();
  }

  orderbook$(pair: string): Observable<Orderbook> {
    return empty();
  }

  stopOrderbook(pair: string): void {}

  fetchTrades$(pair: string): Observable<Trade[]> {
    return empty();
  }

  trade$(pair: string): Observable<Trade> {
    return empty();
  }

  stopTrade(pair: string): void {}

  fetchCandleStickRange$(pair: string, minutesFoot: number, start: number, end: number): Observable<CandleStick[]> {
    return empty();
  }
}
