import { Observable } from 'rxjs';

import { PubnubRxJs } from '../../common';
import { ExchangeApi } from '../exchange-api.abstract';
import { ExchangeInfo, SupportFeatures, Ticker, Orderbook, Trade, CandleStick } from '../exchange-types';
import { subscribeKey } from './bitbank-common';
import { BitbankCandlestick } from './candlestick';
import { BitbankTicker } from './ticker';
import { BitbankOrderbook } from './orderbook';
import { BitbankTrade } from './trade';

export class BitbankApi extends ExchangeApi {
  private readonly pubnub: PubnubRxJs;
  private readonly bitbankCandlestick: BitbankCandlestick;
  private readonly bitbankTicker: BitbankTicker;
  private readonly bitbankOrderbook: BitbankOrderbook;
  private readonly bitbankTrade: BitbankTrade;

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
    return ['btc_jpy', 'xrp_jpy', 'eth_btc', 'ltc_btc', 'mona_jpy', 'mona_btc', 'bcc_jpy', 'bcc_btc'];
  }

  get representativeMarkets(): string[] {
    return ['btc_jpy', 'xrp_jpy'];
  }

  get supportFeatures(): SupportFeatures {
    return {
      ticker: true,
      orderbook: true,
      chart: true,
    };
  }

  constructor() {
    super();
    this.pubnub = new PubnubRxJs({ subscribeKey });
    this.bitbankCandlestick = new BitbankCandlestick();
    this.bitbankTicker = new BitbankTicker(this.pubnub);
    this.bitbankOrderbook = new BitbankOrderbook(this.pubnub);
    this.bitbankTrade = new BitbankTrade(this.pubnub);
  }

  async fetchTicker(pair: string): Promise<Ticker> {
    return this.bitbankTicker.fetchTicker(pair);
  }

  ticker$(pair: string): Observable<Ticker> {
    return this.bitbankTicker.ticker$(pair);
  }

  stopTicker(pair: string): void {
    this.bitbankTicker.stopTicker(pair);
  }

  async fetchOrderbook(pair: string): Promise<Orderbook> {
    return this.bitbankOrderbook.fetchOrderbook(pair);
  }

  orderbook$(pair: string): Observable<Orderbook> {
    return this.bitbankOrderbook.orderbook$(pair);
  }

  stopOrderbook(pair: string): void {
    this.bitbankOrderbook.stopOrderbook(pair);
  }

  async fetchTrades(pair: string): Promise<Trade[]> {
    return this.bitbankTrade.fetchTrades(pair);
  }

  trade$(pair: string): Observable<Trade> {
    return this.bitbankTrade.trade$(pair);
  }

  stopTrade(pair: string): void {
    this.bitbankTrade.stopTrade(pair);
  }

  async fetchCandleStickRange(pair: string, minutesFoot: number, start: number, end: number): Promise<CandleStick[]> {
    return this.bitbankCandlestick.fetchCandleStickRange(pair, minutesFoot, start, end);
  }
}
