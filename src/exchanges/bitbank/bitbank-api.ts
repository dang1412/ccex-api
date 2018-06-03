import { Observable, empty } from 'rxjs';
import { map, concat } from 'rxjs/operators';

import { PubnubRxJs, fetchRxjs } from '../../common';
import { ExchangeApi } from '../exchange-api.abstract';
import { ExchangeInfo, SupportFeatures, Ticker, Orderbook, CandleStick } from '../exchange.type';
import { publicUrl, subscribeKey } from './bitbank-common';
import { RawData, BitbankTicker } from './bitbank-types';
import { BitbankCandlestick } from './bitbank-candlestick';


export class BitbankApi extends ExchangeApi {
  private pubnub: PubnubRxJs;
  private bitbankCandlestick: BitbankCandlestick;

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
  }

  ticker$(pair: string): Observable<Ticker> {
    return this.fetchTicker$(pair).pipe(
      concat(this.pubnubTicker$(pair))
    );
  }

  fetchTicker$(pair: string): Observable<Ticker> {
    const tickerUrl = publicUrl + `/${pair}/ticker`;
    return fetchRxjs<RawData<BitbankTicker>>(tickerUrl).pipe(
      map(rawTicker => adaptBitbankTicker(rawTicker.data, pair))
    );
  }

  stopTicker(pair: string): void {
    const channel = 'ticker_' + pair;
    this.pubnub.unsubscribeChannel(channel);
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

  private pubnubTicker$(pair: string): Observable<Ticker> {
    const channel = 'ticker_' + pair;
    return this.pubnub.subscribeChannel<RawData<BitbankTicker>>(channel).pipe(
      map(bitbankPubnubTicker => adaptBitbankTicker(bitbankPubnubTicker.data, pair))
    );
  }
}

function adaptBitbankTicker(bitbankTicker: BitbankTicker, pair: string): Ticker {
  return {
    pair: pair,
    ask: +bitbankTicker.sell,
    bid: +bitbankTicker.buy,
    low: +bitbankTicker.low,
    high: +bitbankTicker.high,
    last: +bitbankTicker.last,
    vol: +bitbankTicker.vol,
    timestamp: bitbankTicker.timestamp
  };
}
