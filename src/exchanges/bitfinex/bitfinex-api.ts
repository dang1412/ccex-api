import { Observable, empty } from 'rxjs';

import { ExchangeApi } from '../exchange-api.abstract';
import { ExchangeInfo, SupportFeatures, Ticker, Orderbook, CandleStick } from '../exchange.type';

export class BitfinexApi extends ExchangeApi {
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

  get testMarkets(): string[] {
    return [
      'btc_usd',
      'eos_btc',
      'eth_btc',
      'ltc_btc',
      'bcc_btc',
    ];
  }

  get supportFeatures(): SupportFeatures {
    return {
      ticker: true,
      depth: true,
      chart: true
    };
  }

  ticker$(pair: string): Observable<Ticker> {
    return empty();
  }

  fetchTicker$(pair: string): Observable<Ticker> {
    return empty();
  }

  stopTicker(pair: string): void {

  }

  fetchOrderbook$(pair: string): Observable<Orderbook> {
    return empty();
  }

  orderbook$(pair: string): Observable<Orderbook> {
    return empty();
  }

  stopOrderbook(pair: string): void {

  }

  fetchCandleStickRange$(pair: string, minutesFoot: number, start: number, end: number): Observable<CandleStick[]> {
    return empty();
  }

  lastCandle$(pair: string, minutesFoot: number): Observable<CandleStick> {
    return empty();
  }
}
