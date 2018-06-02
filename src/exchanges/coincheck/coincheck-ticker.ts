import { Observable, empty } from 'rxjs';

import { rxjsFetch } from '../../common';
import { Ticker } from '../exchange.type';
import { CoincheckRawTicker } from './coincheck-types';
import { adaptCoincheckRawTicker, publicUrl } from './coincheck-functions';
import { map } from 'rxjs/operators';

export class CoincheckTicker {
  fetchTicker$(pair: string): Observable<Ticker> {
    const url = publicUrl + '/api/ticker';
    return rxjsFetch<CoincheckRawTicker>(url).pipe(map(coincheckRawTicker => adaptCoincheckRawTicker(coincheckRawTicker, pair)));
  }

  ticker$(pair: string): Observable<Ticker> {
    // receive rawTicker and adapt to Ticker here
    return empty();
  }

  stopTicker(pair: string) {}
}
