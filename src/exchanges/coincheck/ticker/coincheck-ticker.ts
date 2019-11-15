import fetch from 'node-fetch';

import { Observable, EMPTY } from 'rxjs';

import { Ticker } from '../../exchange-types';
import { CoincheckRawTicker } from '../coincheck-types';
import { adaptCoincheckRawTicker, publicUrl } from '../coincheck-functions';

export class CoincheckTicker {
  async fetchTicker(pair: string): Promise<Ticker> {
    const url = `${publicUrl}/api/ticker`;

    const rawTicker: CoincheckRawTicker = await fetch(url).then(res => res.json());

    return adaptCoincheckRawTicker(rawTicker, pair);
  }

  ticker$(pair: string): Observable<Ticker> {
    // receive rawTicker and adapt to Ticker here
    return EMPTY;
  }

  stopTicker(pair: string): void {
    // implement
  }
}
