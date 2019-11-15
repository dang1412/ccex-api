import fetch from 'node-fetch';

import { Observable, concat } from 'rxjs';
import { map } from 'rxjs/operators';

import { PubnubRxJs } from '../../../common';
import { Orderbook } from '../../exchange-types';
import { publicUrl, subscribeKey, RawData } from '../bitbank-common';

export class BitbankOrderbook {
  private readonly pubnub: PubnubRxJs;

  constructor(pubnub?: PubnubRxJs) {
    this.pubnub = pubnub || new PubnubRxJs({ subscribeKey });
  }

  async fetchOrderbook(pair: string): Promise<Orderbook> {
    const url = `${publicUrl}/${pair}/depth`;
    const raw: RawData<Orderbook> = await fetch(url).then(res => res.json());

    return raw.data;
  }

  orderbook$(pair: string): Observable<Orderbook> {
    return concat(this.fetchOrderbook(pair), this.pubnubOrderbook$(pair));
  }

  stopOrderbook(pair: string): void {
    const channel = `depth_${pair}`;
    this.pubnub.unsubscribeChannel(channel);
  }

  private pubnubOrderbook$(pair: string): Observable<Orderbook> {
    const channel = `depth_${pair}`;

    return this.pubnub.subscribeChannel<RawData<Orderbook>>(channel).pipe(map((raw) => raw.data));
  }
}
