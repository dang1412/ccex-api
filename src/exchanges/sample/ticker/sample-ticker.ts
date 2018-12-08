import { Observable, EMPTY } from 'rxjs';

import { Ticker } from '../../exchange-types';

export class SampleTicker {
  fetchTicker$(pair: string): Observable<Ticker> {
    return EMPTY;
  }

  ticker$(pair: string): Observable<Ticker> {
    // receive rawTicker and adapt to Ticker here
    return EMPTY;
  }

  stopTicker(pair: string): void {
    // implement
  }
}
