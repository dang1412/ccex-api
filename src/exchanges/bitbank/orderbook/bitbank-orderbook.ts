import { Observable } from 'rxjs';
import { map, concat } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

import { PubnubRxJs } from '../../../common';
import { Orderbook } from '../../exchange-types';
import { publicUrl, subscribeKey, RawData } from '../bitbank-common';

export class BitbankOrderbook {
  private readonly pubnub: PubnubRxJs;

  constructor(pubnub?: PubnubRxJs) {
    this.pubnub = pubnub || new PubnubRxJs({ subscribeKey });
  }

  fetchOrderbook$(pair: string): Observable<Orderbook> {
    const orderbookUrl = `${publicUrl}/${pair}/depth`;

    return ajax.getJSON<RawData<Orderbook>>(orderbookUrl).pipe(map((raw) => raw.data));
  }

  orderbook$(pair: string): Observable<Orderbook> {
    return this.fetchOrderbook$(pair).pipe(concat(this.pubnubOrderbook$(pair)));
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
