import { Observable, concat } from 'rxjs';
import { map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

import { PubnubRxJs } from '../../../common';
import { Ticker } from '../../exchange-types';
import { publicUrl, subscribeKey, RawData } from '../bitbank-common';
import { BitbankRawTicker } from './internal/types';
import { adaptBitbankTicker } from './internal/functions';

export class BitbankTicker {
  private readonly pubnub: PubnubRxJs;

  constructor(pubnub?: PubnubRxJs) {
    this.pubnub = pubnub || new PubnubRxJs({ subscribeKey });
  }

  fetchTicker$(pair: string): Observable<Ticker> {
    const tickerUrl = `${publicUrl}/${pair}/ticker`;

    return ajax.getJSON<RawData<BitbankRawTicker>>(tickerUrl).pipe(map((rawTicker) => adaptBitbankTicker(rawTicker.data, pair)));
  }

  ticker$(pair: string): Observable<Ticker> {
    return concat(this.fetchTicker$(pair), this.pubnubTicker$(pair));
  }

  stopTicker(pair: string): void {
    const channel = `ticker_${pair}`;
    this.pubnub.unsubscribeChannel(channel);
  }

  private pubnubTicker$(pair: string): Observable<Ticker> {
    const channel = `ticker_${pair}`;

    return this.pubnub
      .subscribeChannel<RawData<BitbankRawTicker>>(channel)
      .pipe(map((bitbankPubnubTicker) => adaptBitbankTicker(bitbankPubnubTicker.data, pair)));
  }
}
