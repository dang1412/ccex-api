import { Observable, EMPTY } from 'rxjs';
import { map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

import { Ticker } from '../../exchange-types';
import { CoincheckRawTicker } from '../coincheck-types';
import { adaptCoincheckRawTicker, publicUrl } from '../coincheck-functions';

export class CoincheckTicker {
  fetchTicker$(pair: string): Observable<Ticker> {
    const url = `${publicUrl}/api/ticker`;

    return ajax.getJSON<CoincheckRawTicker>(url).pipe(map((coincheckRawTicker) => adaptCoincheckRawTicker(coincheckRawTicker, pair)));
  }

  ticker$(pair: string): Observable<Ticker> {
    // receive rawTicker and adapt to Ticker here
    return EMPTY;
  }

  stopTicker(pair: string): void {
    // implement
  }
}
