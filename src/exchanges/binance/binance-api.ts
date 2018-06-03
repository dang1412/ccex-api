import { Observable, empty } from 'rxjs';

import { ExchangeApi } from '../exchange-api.abstract';
import { ExchangeInfo, SupportFeatures, Ticker, Orderbook, CandleStick } from '../exchange-types';

export class BinanceApi extends ExchangeApi {
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
