import { Observable, of, empty } from 'rxjs';
import { map, concat } from 'rxjs/operators';

import { PubnubRxJs } from '../../common/pubnub-rxjs';
import { ExchangeApi } from '../exchange-api.abstract';
import { ExchangeInfo, SupportFeatures, Ticker, Depth, CandleStick } from '../exchange.type';

const publicUrl = 'https://public.bitbank.cc/';
const subscribeKey = 'sub-c-e12e9174-dd60-11e6-806b-02ee2ddab7fe';

interface RawData<T> {
  success: 1;
  data: T;
}

interface BitbankTicker {
  pair: string;
  sell: string;
  buy: string;
  low: string;
  high: string;
  last: string;
  vol: string;
  timestamp: number;
}

interface BitbankPubnubTicker {
  data: BitbankTicker;
}

export class Bitbank extends ExchangeApi {
  private pubnub: PubnubRxJs;

  get exchangeInfo(): ExchangeInfo {
    return {
      name: 'bitbank',
      logoUrl: 'https://bitbank.cc/assets/images/bitbank_logo.svg',
      homepage: 'https://bitbank.cc',
      country: 'jp',
    };
  }

  get marketNames(): Observable<string[]> {
    return of([
      'btc_jpy',
      'xrp_jpy',
      'eth_btc',
      'ltc_btc',
      'mona_jpy',
      'mona_btc',
      'bcc_jpy',
      'bcc_btc',
    ]);
  }

  get supportFeatures(): SupportFeatures {
    return {
      ticker: true,
      depth: true,
      chart: true
    };
  }

  constructor() {
    super();
    this.pubnub = new PubnubRxJs({subscribeKey});
  }

  getTicker$(pair: string): Observable<Ticker> {
    return this.fetchTicker$(pair).pipe(
      concat(this.pubnubTicker$(pair))
    );
  }

  fetchTicker$(pair: string): Observable<Ticker> {
    const tickerUrl = publicUrl + `${pair}/ticker`;
    return this.fetch<RawData<BitbankTicker>>(tickerUrl).pipe(
      map(rawTicker => adaptBitbankTicker(rawTicker.data))
    );
  }

  stopTicker(pair: string): void {
    const channel = 'ticker_' + pair;
    this.pubnub.unsubscribeChannel(channel);
  }

  getDepth$(pair: string): Observable<Depth> {
    return empty();
  }

  stopDepth(pair: string): void {

  }

  getCandleStickRange$(pair: string, minutesFoot: number, start: number, end: number): Observable<CandleStick[]> {
    return empty();
  }

  getLastCandle$(pair: string, minutesFoot: number): Observable<CandleStick> {
    return empty();
  }

  private pubnubTicker$(pair: string): Observable<Ticker> {
    const channel = 'ticker_' + pair;
    return this.pubnub.subscribeChannel<BitbankPubnubTicker>(channel).pipe(
      map(bitbankPubnubTicker => adaptBitbankTicker(bitbankPubnubTicker.data))
    );
  }
}

function adaptBitbankTicker(bitbankTicker: BitbankTicker): Ticker {
  return {
    pair: bitbankTicker.pair,
    sell: +bitbankTicker.sell,
    buy: +bitbankTicker.buy,
    low: +bitbankTicker.low,
    high: +bitbankTicker.high,
    last: +bitbankTicker.last,
    vol: +bitbankTicker.vol,
    timestamp: bitbankTicker.timestamp
  };
}
