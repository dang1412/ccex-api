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
  private corsProxy: string;

  constructor(key: string, corsProxy?: string) {
    this.key = key;
    this.corsProxy = corsProxy;
  }

  getUserStreamListenKey$(): Observable<string> {
    const originUrl = `${apiEndPoint}/${PrivateUrl.userStream}`;
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    const fetchOptions = {
      method: 'POST',
      headers: {
        'X-MBX-APIKEY': this.key,
      },
    };

    return fetchRxjs<BinanceUserStreamPostResponse>(url, fetchOptions).pipe(map(res => res.listenKey));
  }
}
