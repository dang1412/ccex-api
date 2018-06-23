import { Observable } from 'rxjs';

import { ExchangeApi } from '../exchange-api.abstract';
import { ExchangeInfo, SupportFeatures, Ticker, Orderbook, Trade, CandleStick, ExchangeOptions } from '../exchange-types';
import { defaultOptions } from '../exchange-default.options';
import { BinanceTicker } from './ticker';
import { BinanceOrderbook } from './orderbook';
import { BinanceTrade } from './trade';
import { BinanceCandleStick } from './candlestick';

export class BinanceApi extends ExchangeApi {
  private options: ExchangeOptions;
  private binanceTicker: BinanceTicker;
  private binanceOrderbook: BinanceOrderbook;
  private binanceTrade: BinanceTrade;
  private binanceCandleStick: BinanceCandleStick;

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

  get representativeMarkets(): string[] {
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
    this.binanceTrade = new BinanceTrade(corsProxy);
    this.binanceCandleStick = new BinanceCandleStick(corsProxy);
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
    return this.binanceTrade.fetchTrades$(pair);
  }

  trade$(pair: string): Observable<Trade> {
    return this.binanceTrade.trade$(pair);
  }

  stopTrade(pair: string): void {
    this.binanceTrade.stopTrade(pair);
  }

  fetchCandleStickRange$(pair: string, minutesFoot: number, start: number, end: number): Observable<CandleStick[]> {
    return this.binanceCandleStick.fetchCandleStickRange$(pair, minutesFoot, start, end);
  }

  candlestick$(pair: string, minutesFoot: number): Observable<CandleStick> {
    return this.binanceCandleStick.candlestick$(pair, minutesFoot);
  }
}
