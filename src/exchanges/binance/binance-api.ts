import { Observable } from 'rxjs';

import { ExchangeApi } from '../exchange-api.abstract';
import { ExchangeInfo, SupportFeatures, Ticker, Orderbook, Trade, CandleStick, ExchangeOptions } from '../exchange-types';
import { BinanceTicker } from './ticker';
import { BinanceOrderbook } from './orderbook';
import { BinanceTrade } from './trade';
import { BinanceCandleStick } from './candlestick';
import { BinanceWebsocket } from './websocket';

export class BinanceApi extends ExchangeApi {
  private readonly binanceWebsocket: BinanceWebsocket;
  private readonly binanceTicker: BinanceTicker;
  private readonly binanceOrderbook: BinanceOrderbook;
  private readonly binanceTrade: BinanceTrade;
  private readonly binanceCandleStick: BinanceCandleStick;

  get exchangeInfo(): ExchangeInfo {
    return {
      name: 'binance',
      logoUrl: 'https://www.binance.com/resources/img/logo-en.svg',
      homepage: 'https://www.binance.com/?ref=16635017',
      country: 'cn',
    };
  }

  get markets(): string[] {
    return ['btc_usdt', 'eos_btc', 'eth_btc', 'ltc_btc', 'bcc_btc'];
  }

  get representativeMarkets(): string[] {
    return ['btc_usdt', 'eos_btc', 'eth_btc'];
  }

  get supportFeatures(): SupportFeatures {
    return {
      ticker: true,
      orderbook: true,
      chart: true,
    };
  }

  constructor(options?: ExchangeOptions) {
    super(options);
    const corsProxy = this.options.corsProxy;

    this.binanceWebsocket = new BinanceWebsocket();
    this.binanceTicker = new BinanceTicker(this.binanceWebsocket, corsProxy);
    this.binanceOrderbook = new BinanceOrderbook(this.binanceWebsocket, corsProxy);
    this.binanceTrade = new BinanceTrade(this.binanceWebsocket, corsProxy);
    this.binanceCandleStick = new BinanceCandleStick(this.binanceWebsocket, corsProxy);
  }

  /**
   * Implement common interface
   */

  async fetchTicker(pair: string): Promise<Ticker> {
    return this.binanceTicker.fetch(pair);
  }

  ticker$(pair: string): Observable<Ticker> {
    return this.binanceTicker.stream$(pair);
  }

  stopTicker(pair: string): void {
    this.binanceTicker.stop(pair);
  }

  async fetchOrderbook(pair: string): Promise<Orderbook> {
    return this.binanceOrderbook.fetch(pair);
  }

  orderbook$(pair: string): Observable<Orderbook> {
    return this.binanceOrderbook.stream$(pair);
  }

  stopOrderbook(pair: string): void {
    this.binanceOrderbook.stop(pair);
  }

  async fetchTrades(pair: string): Promise<Trade[]> {
    return this.binanceTrade.fetch(pair);
  }

  trade$(pair: string): Observable<Trade> {
    return this.binanceTrade.stream$(pair);
  }

  stopTrade(pair: string): void {
    this.binanceTrade.stop(pair);
  }

  async fetchCandleStickRange(pair: string, minutesFoot: number, start: number, end: number): Promise<CandleStick[]> {
    return this.binanceCandleStick.fetchRange(pair, minutesFoot, start, end);
  }

  /**
   * Specific exchange functions
   */

  async fetchOrderbookLimit(pair: string, limit: number): Promise<Orderbook> {
    return this.binanceOrderbook.fetch(pair, limit);
  }

  candlestick$(pair: string, minutesFoot: number): Observable<CandleStick> {
    return this.binanceCandleStick.stream$(pair, minutesFoot);
  }

  stopCandleStick(pair: string, minutesFoot: number): void {
    this.binanceCandleStick.stop(pair, minutesFoot);
  }
}
