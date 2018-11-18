import { Observable, empty } from 'rxjs';

import { Ticker } from '../../exchange-types';

export class BitmexTicker {
  fetchTicker$(pair: string): Observable<Ticker> {
    return empty();
  }

  ticker$(pair: string): Observable<Ticker> {
    // receive rawTicker and adapt to Ticker here
    return empty();
  }

  stopTicker(pair: string) {
    // implement
  }
}
