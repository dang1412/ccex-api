import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';

import { apiEndPoint } from '../binance-common';
import { BinanceUserStreamPostResponse } from './internal/types';
import { map } from 'rxjs/operators';

enum PrivateUrl {
  userStream = 'api/v1/userDataStream',
}

export class BinanceApiPrivate {
  private readonly key: string;
  private readonly corsProxy: string;

  constructor(key: string, corsProxy?: string) {
    this.key = key;
    this.corsProxy = corsProxy || '';
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

    return ajax.getJSON<BinanceUserStreamPostResponse>(url, fetchOptions).pipe(map((res) => res.listenKey));
  }
}
