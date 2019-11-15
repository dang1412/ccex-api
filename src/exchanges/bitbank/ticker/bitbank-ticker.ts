import fetch from 'node-fetch';

import { Observable, concat } from 'rxjs';
import { map } from 'rxjs/operators';

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

  async fetchTicker(pair: string): Promise<Ticker> {
    const url = `${publicUrl}/${pair}/ticker`;
    const raw: RawData<BitbankRawTicker> = await fetch(url).then(res => res.json());

    return adaptBitbankTicker(raw.data, pair);
  }

  ticker$(pair: string): Observable<Ticker> {
    return concat(this.fetchTicker(pair), this.pubnubTicker$(pair));
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
