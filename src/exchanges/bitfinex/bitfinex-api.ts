import { Observable, empty } from 'rxjs';

import { ExchangeApi } from '../exchange-api.abstract';
import { ExchangeInfo, SupportFeatures, Ticker, Orderbook, Trade, CandleStick } from '../exchange-types';
import { BitfinexWebsocket } from './bitfinex-websocket';
import { BitfinexTicker } from './ticker';
import { BitfinexOrderbook } from './orderbook'

export class BitfinexApi extends ExchangeApi {
  private bitfinexWebsocket: BitfinexWebsocket;
  private bitfinexTicker: BitfinexTicker;
  private bitfinexOrderbook: BitfinexOrderbook;

  get exchangeInfo(): ExchangeInfo {
    return {
      name: 'bitfinex',
      logoUrl: 'https://files.readme.io/65ad6c8-small-logo.png',
      homepage: 'https://www.bitfinex.com/',
      country: 'British Virgin Islands'
    };
  }

  get markets(): string[] {
    return [
      'btc_usd',
      'eos_btc',
      'eth_btc',
      'ltc_btc',
      'bcc_btc',
    ];
  }

  get representativeMarkets(): string[] {
    return [
      'btc_usd',
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
    this.bitfinexWebsocket = new BitfinexWebsocket();
    this.bitfinexTicker = new BitfinexTicker(this.bitfinexWebsocket);
    this.bitfinexOrderbook = new BitfinexOrderbook(this.bitfinexWebsocket);
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
