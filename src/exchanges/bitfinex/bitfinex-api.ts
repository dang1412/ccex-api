import { Observable, empty } from 'rxjs';

import { ExchangeApi } from '../exchange-api.abstract';
import { ExchangeInfo, SupportFeatures, Ticker, Orderbook, Trade, CandleStick, ExchangeOptions } from '../exchange-types';
import { BitfinexWebsocket } from './websocket';
import { BitfinexTicker } from './ticker';
import { BitfinexOrderbook } from './orderbook';
import { BitfinexCandleStick } from './candlestick';
import { BitfinexTrade } from './trade';

export class BitfinexApi extends ExchangeApi {
  private bitfinexWebsocket: BitfinexWebsocket;
  private bitfinexTicker: BitfinexTicker;
  private bitfinexOrderbook: BitfinexOrderbook;
  private bitfinexCandleStick: BitfinexCandleStick;
  private bitfinexTrade: BitfinexTrade;

  get exchangeInfo(): ExchangeInfo {
    return {
      name: 'bitfinex',
      logoUrl: 'https://files.readme.io/65ad6c8-small-logo.png',
      homepage: 'https://www.bitfinex.com/',
      country: 'British Virgin Islands',
    };
  }

  get markets(): string[] {
    return ['btc_usd', 'eos_btc', 'eth_btc', 'ltc_btc', 'bcc_btc'];
  }

  get representativeMarkets(): string[] {
    return ['btc_usd', 'eos_btc', 'eth_btc'];
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

    this.bitfinexWebsocket = new BitfinexWebsocket();
    this.bitfinexTicker = new BitfinexTicker(this.bitfinexWebsocket);
    this.bitfinexOrderbook = new BitfinexOrderbook(this.bitfinexWebsocket);
    this.bitfinexCandleStick = new BitfinexCandleStick(corsProxy, this.bitfinexWebsocket);
    this.bitfinexTrade = new BitfinexTrade(corsProxy, this.bitfinexWebsocket);
  }

  fetchTicker$(pair: string): Observable<Ticker> {
    return empty();
  }

  ticker$(pair: string): Observable<Ticker> {
    return this.bitfinexTicker.ticker$(pair);
  }

  stopTicker(pair: string): void {
    this.bitfinexTicker.stopTicker(pair);
  }

  fetchOrderbook$(pair: string): Observable<Orderbook> {
    return empty();
  }

  orderbook$(pair: string): Observable<Orderbook> {
    return this.bitfinexOrderbook.orderbook$(pair);
  }

  stopOrderbook(pair: string): void {
    this.bitfinexOrderbook.stopOrderbook(pair);
  }

  fetchTrades$(pair: string): Observable<Trade[]> {
    return this.bitfinexTrade.fetchTrades$(pair);
  }

  trade$(pair: string): Observable<Trade> {
    return this.bitfinexTrade.trade$(pair);
  }

  stopTrade(pair: string): void {
    this.bitfinexTrade.stopTrade(pair);
  }

  fetchCandleStickRange$(pair: string, minutesFoot: number, start: number, end: number): Observable<CandleStick[]> {
    return this.bitfinexCandleStick.fetchCandleStickRange$(pair, minutesFoot, start, end);
  }

  candlestick$(pair: string, minutesFoot: number): Observable<CandleStick> {
    return this.bitfinexCandleStick.candlestick$(pair, minutesFoot);
  }

  candlestickWithInitialHistory$(pair: string, minutesFoot: number): Observable<CandleStick[] | CandleStick> {
    return this.bitfinexCandleStick.candlestickWithInitialHistory$(pair, minutesFoot);
  }
}
