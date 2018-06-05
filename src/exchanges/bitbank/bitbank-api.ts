import { Observable, empty } from 'rxjs';

import { PubnubRxJs } from '../../common';
import { ExchangeApi } from '../exchange-api.abstract';
import { ExchangeInfo, SupportFeatures, Ticker, Orderbook, CandleStick } from '../exchange-types';
import { subscribeKey } from './bitbank-common';
import { BitbankCandlestick } from './bitbank-candlestick';
import { BitbankTicker } from './bitbank-ticker';


export class BitbankApi extends ExchangeApi {
  private pubnub: PubnubRxJs;
  private bitbankCandlestick: BitbankCandlestick;
  private bitbankTicker: BitbankTicker;

  get pubnubRxJs(): PubnubRxJs {
    return this.pubnub;
  }

  get exchangeInfo(): ExchangeInfo {
    return {
      name: 'bitbank',
      logoUrl: 'https://bitbank.cc/assets/images/bitbank_logo.svg',
      homepage: 'https://bitbank.cc',
      country: 'jp',
    };
  }

  get markets(): string[] {
    return [
      'btc_jpy',
      'xrp_jpy',
      'eth_btc',
      'ltc_btc',
      'mona_jpy',
      'mona_btc',
      'bcc_jpy',
      'bcc_btc',
    ];
  }

  get testMarkets(): string[] {
    return [
      'btc_jpy',
      'xrp_jpy',
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
    this.pubnub = new PubnubRxJs({subscribeKey});
    this.bitbankCandlestick = new BitbankCandlestick();
    this.bitbankTicker = new BitbankTicker(this.pubnub);
  }

  fetchTicker$(pair: string): Observable<Ticker> {
    return this.bitbankTicker.fetchTicker$(pair);
  }

  ticker$(pair: string): Observable<Ticker> {
    return this.bitbankTicker.ticker$(pair);
  }

  stopTicker(pair: string): void {
    this.bitbankTicker.stopTicker(pair);
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
    return this.bitbankCandlestick.fetchCandleStickRange$(pair, minutesFoot, start, end);
  }

  lastCandle$(pair: string, minutesFoot: number): Observable<CandleStick> {
    return empty();
  }
}
