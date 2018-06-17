import { Observable, empty } from 'rxjs';

import { ExchangeApi } from '../exchange-api.abstract';
import { ExchangeInfo, SupportFeatures, Ticker, Orderbook, Trade, CandleStick, ExchangeOptions } from '../exchange-types';
import { defaultOptions } from '../exchange-default.options';
import { BinanceTicker } from './ticker/binance-ticker';
import { BinanceOrderbook } from './orderbook/binance-orderbook';

export class BinanceApi extends ExchangeApi {
  private options: ExchangeOptions;
  private binanceTicker: BinanceTicker;
  private binanceOrderbook: BinanceOrderbook;

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

  constructor(options?: ExchangeOptions) {
    super();

    this.options = Object.assign({}, defaultOptions, options);
    const corsProxy = this.options.corsProxy;

    this.binanceTicker = new BinanceTicker(corsProxy);
    this.binanceOrderbook = new BinanceOrderbook(corsProxy);
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
    return this.binanceOrderbook.fetchOrderbook$(pair);
  }

  orderbook$(pair: string): Observable<Orderbook> {
    return this.binanceOrderbook.orderbook$(pair);
  }

  stopOrderbook(pair: string): void {
    this.binanceOrderbook.stopOrderbook(pair);
  }

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
