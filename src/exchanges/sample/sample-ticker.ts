import { Observable, empty } from 'rxjs';

import { Ticker } from '../exchange-types';
// import { SampleRawTicker } from './sample-types';
// import { adaptSampleRawTicker } from './sample-functions';

export class SampleTicker {
  fetchTicker$(pair: string): Observable<Ticker> {
    // receive rawTicker and adapt to Ticker here
    return empty();
  }

  ticker$(pair: string): Observable<Ticker> {
    // receive rawTicker and adapt to Ticker here
    return empty();
  }

  stopTicker(pair: string) {}
}
