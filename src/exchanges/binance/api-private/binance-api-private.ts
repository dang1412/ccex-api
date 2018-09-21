import { Observable } from 'rxjs';

import { fetchRxjs } from '../../../common';
import { apiEndPoint } from '../binance-common';
import { BinanceUserStreamPostResponse } from './internal/types';
import { map } from 'rxjs/operators';

enum PrivateUrl {
  userStream = 'api/v1/userDataStream'
}

export class BinanceApiPrivate {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  getUserStreamListenKey(): Observable<string> {
    const url = `${apiEndPoint}/${PrivateUrl.userStream}`;
    const fetchOptions = {
      method: 'POST',
      headers: {
        'X-MBX-APIKEY': this.key,
      },
    };

    return fetchRxjs<BinanceUserStreamPostResponse>(url, fetchOptions).pipe(map(res => res.listenKey));
  }
}
