import { Observable, EMPTY } from 'rxjs';

import { ExchangeApi } from '../exchange-api.abstract';
import { ExchangeInfo, SupportFeatures, Ticker, Orderbook, Trade, CandleStick, ExchangeOptions } from '../exchange-types';
import { BitmexWebsocket } from './websocket';
import { BitmexTrade } from './trade';
import { BitmexOrderbook } from './orderbook';
import { BitmexCandleStick } from './candlestick';

export class BitmexApi extends ExchangeApi {
  private readonly bitmexWebsocket: BitmexWebsocket;
  private readonly bitmexOrderbook: BitmexOrderbook;
  private readonly bitmexCandleStick: BitmexCandleStick;
  private readonly bitmexTrade: BitmexTrade;

  get exchangeInfo(): ExchangeInfo {
    return {
      name: 'bitmex',
      logoUrl: 'https://www.bitmex.com/img/bitmex-logo-alt-white.png',
      homepage: 'https://www.bitmex.com/',
      country: 'Hong Kong',
    };
  }

  get markets(): string[] {
    return ['xbt_usd', 'adaz18', 'eosz18', 'bchz18', 'ethz18', 'ltcz18', 'xrpz18', 'trxz18'];
  }

  get representativeMarkets(): string[] {
    return [];
  }

  get supportFeatures(): SupportFeatures {
    return {
      ticker: false,
      orderbook: true,
      chart: true,
    };
  }

  constructor(options?: ExchangeOptions) {
    super(options);
    const corsProxy = this.options.corsProxy;

    this.bitmexWebsocket = new BitmexWebsocket();
    this.bitmexOrderbook = new BitmexOrderbook(corsProxy, this.bitmexWebsocket);
    this.bitmexCandleStick = new BitmexCandleStick(corsProxy);
    this.bitmexTrade = new BitmexTrade(corsProxy, this.bitmexWebsocket);
  }

  // api request for ticker
  fetchTicker$(pair: string): Observable<Ticker> {
    return EMPTY;
  }

  // realtime ticker
  ticker$(pair: string): Observable<Ticker> {
    return EMPTY;
  }

  // stop realtime ticker
  stopTicker(pair: string): void {
    // implement
  }

  // api request for orderbook
  fetchOrderbook$(pair: string): Observable<Orderbook> {
    return EMPTY;
  }

  // realtime orderbook
  orderbook$(pair: string): Observable<Orderbook> {
    return this.bitmexOrderbook.orderbook$(pair);
  }

  // stop realtime orderbook
  stopOrderbook(pair: string): void {
    this.bitmexOrderbook.stopOrderbook(pair);
  }

  fetchTrades$(pair: string): Observable<Trade[]> {
    return EMPTY;
  }

  trade$(pair: string): Observable<Trade> {
    return this.bitmexTrade.trade$(pair);
  }

  // stop realtime trade
  stopTrade(pair: string): void {
    this.bitmexTrade.stopTrade(pair);
  }

  // request candlestick by time range and resolution
  fetchCandleStickRange$(pair: string, minutesFoot: number, start: number, end: number): Observable<CandleStick[]> {
    return this.bitmexCandleStick.fetchCandleStickRange$(pair, minutesFoot, start, end);
  }
}
