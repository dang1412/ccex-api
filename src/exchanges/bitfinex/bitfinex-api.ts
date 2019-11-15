import { Observable } from 'rxjs';

import { ExchangeApi } from '../exchange-api.abstract';
import { ExchangeInfo, SupportFeatures, Ticker, Orderbook, Trade, CandleStick, ExchangeOptions } from '../exchange-types';
import { BitfinexWebsocket } from './websocket';
import { BitfinexTicker } from './ticker';
import { BitfinexOrderbook } from './orderbook';
import { BitfinexCandleStick } from './candlestick';
import { BitfinexTrade } from './trade';

export class BitfinexApi extends ExchangeApi {
  private readonly bitfinexWebsocket: BitfinexWebsocket;
  private readonly bitfinexTicker: BitfinexTicker;
  private readonly bitfinexOrderbook: BitfinexOrderbook;
  private readonly bitfinexCandleStick: BitfinexCandleStick;
  private readonly bitfinexTrade: BitfinexTrade;

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
    this.bitfinexTicker = new BitfinexTicker(corsProxy, this.bitfinexWebsocket);
    this.bitfinexOrderbook = new BitfinexOrderbook(corsProxy, this.bitfinexWebsocket);
    this.bitfinexCandleStick = new BitfinexCandleStick(corsProxy, this.bitfinexWebsocket);
    this.bitfinexTrade = new BitfinexTrade(corsProxy, this.bitfinexWebsocket);
  }

  async fetchTicker(pair: string): Promise<Ticker> {
    return this.bitfinexTicker.fetchTicker(pair);
  }

  ticker$(pair: string): Observable<Ticker> {
    return this.bitfinexTicker.ticker$(pair);
  }

  stopTicker(pair: string): void {
    this.bitfinexTicker.stopTicker(pair);
  }

  async fetchOrderbook(pair: string): Promise<Orderbook> {
    return this.bitfinexOrderbook.fetchOrderbook(pair);
  }

  orderbook$(pair: string): Observable<Orderbook> {
    return this.bitfinexOrderbook.orderbook$(pair);
  }

  stopOrderbook(pair: string): void {
    this.bitfinexOrderbook.stopOrderbook(pair);
  }

  async fetchTrades(pair: string): Promise<Trade[]> {
    return this.bitfinexTrade.fetchTrades(pair);
  }

  trade$(pair: string): Observable<Trade> {
    return this.bitfinexTrade.trade$(pair);
  }

  stopTrade(pair: string): void {
    this.bitfinexTrade.stopTrade(pair);
  }

  async fetchCandleStickRange(pair: string, minutesFoot: number, start: number, end: number): Promise<CandleStick[]> {
    return this.bitfinexCandleStick.fetchCandleStickRange(pair, minutesFoot, start, end);
  }

  candlestick$(pair: string, minutesFoot: number): Observable<CandleStick> {
    return this.bitfinexCandleStick.candlestick$(pair, minutesFoot);
  }

  candlestickWithInitialHistory$(pair: string, minutesFoot: number): Observable<CandleStick[] | CandleStick> {
    return this.bitfinexCandleStick.candlestickWithInitialHistory$(pair, minutesFoot);
  }
}
