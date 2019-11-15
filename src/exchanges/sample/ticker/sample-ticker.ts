import { Observable, EMPTY } from 'rxjs';

import { Ticker } from '../../exchange-types';

export class SampleTicker {
  async fetchTicker(pair: string): Promise<Ticker> {
    return Promise.resolve(undefined as any);
  }

  ticker$(pair: string): Observable<Ticker> {
    // receive rawTicker and adapt to Ticker here
    return EMPTY;
  }

  stopTicker(pair: string): void {
    // implement
  }
}
