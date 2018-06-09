import { Observable } from 'rxjs';
import { map, concat } from 'rxjs/operators';
import { PubnubRxJs, fetchRxjs } from '../../common';

import { Ticker } from '../exchange-types';
import { RawData, BitbankRawTicker } from './bitbank-types';
import { adaptBitbankTicker } from './bitbank-functions';
import { publicUrl, subscribeKey } from './bitbank-common';

export class BitbankTicker {
  private pubnub: PubnubRxJs;

  constructor(pubnub?: PubnubRxJs) {
    this.pubnub = pubnub || new PubnubRxJs({ subscribeKey });
  }

  fetchTicker$(pair: string): Observable<Ticker> {
    const tickerUrl = publicUrl + `/${pair}/ticker`;
    return fetchRxjs<RawData<BitbankRawTicker>>(tickerUrl).pipe(
      map(rawTicker => adaptBitbankTicker(rawTicker.data, pair))
    );
  }

  ticker$(pair: string): Observable<Ticker> {
    return this.fetchTicker$(pair).pipe(
      concat(this.pubnubTicker$(pair))
    );
  }

  stopTicker(pair: string) {
    const channel = 'ticker_' + pair;
    this.pubnub.unsubscribeChannel(channel);
  }

  private pubnubTicker$(pair: string): Observable<Ticker> {
    const channel = 'ticker_' + pair;
    return this.pubnub.subscribeChannel<RawData<BitbankRawTicker>>(channel).pipe(
      map(bitbankPubnubTicker => adaptBitbankTicker(bitbankPubnubTicker.data, pair))
    );
  }
}
