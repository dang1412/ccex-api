import { Observable, from } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';
import { PubnubRxJs, fetchRxjs } from '../../../common';

import { Trade } from '../../exchange-types';
import { publicUrl, subscribeKey, RawData } from '../bitbank-common';
import { BitbankRawTrade } from './internal/types';
import { adaptBitbankTrade } from './internal/functions';

interface BitbankRawTrades {
  transactions: BitbankRawTrade[];
}

export class BitbankTrade {
  private readonly pubnub: PubnubRxJs;

  constructor(pubnub?: PubnubRxJs) {
    this.pubnub = pubnub || new PubnubRxJs({ subscribeKey });
  }

  fetchTrades$(pair: string): Observable<Trade[]> {
    const tradesUrl = `${publicUrl}/${pair}/transactions`;

    return fetchRxjs<RawData<BitbankRawTrades>>(tradesUrl).pipe(map((raw) => raw.data.transactions.map(adaptBitbankTrade)));
  }

  trade$(pair: string): Observable<Trade> {
    const channel = `transactions_${pair}`;

    return this.pubnub.subscribeChannel<RawData<BitbankRawTrades>>(channel).pipe(
      map((raw) => raw.data.transactions.map(adaptBitbankTrade)),
      // sort the trades in ascending order of timestamp (old to new one)
      map((trades) => trades.sort((t1, t2) => t1.timestamp - t2.timestamp)),
      // turn the stream of trade array into stream of single trade
      concatMap((trades) => {
        return from(trades);
      }),
    );
  }

  stopTrade(pair: string): void {
    const channel = `transactions_${pair}`;
    this.pubnub.unsubscribeChannel(channel);
  }
}
