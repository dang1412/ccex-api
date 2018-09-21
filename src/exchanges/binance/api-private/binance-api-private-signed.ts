import * as qs from 'querystring';
import { Observable } from 'rxjs';

import * as crypto from '../../../lib/isomorphic-crypto';
import { fetchRxjs } from '../../../common';
import { apiEndPoint } from '../binance-common';
import { BinanceAccountInformation } from './internal/types';

enum PrivateUrlSigned {
  account = 'api/v3/account',
}

export class BinanceApiPrivateSigned {
  private key: string;
  private secret: string;

  constructor(key: string, secret: string) {
    this.key = key;
    this.secret = secret;
  }

  getAccountInformation(): Observable<BinanceAccountInformation> {
    const params = {
      timestamp: Date.now()
    };

    const queryString = qs.stringify(params);
    const url = `${apiEndPoint}/${PrivateUrlSigned.account}?${queryString}&signature=${this.sign(queryString)}`;

    const fetchOptions = {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'X-MBX-APIKEY': this.key,
      },
      // redirect: 'follow', // manual, *follow, error
      // referrer: 'no-referrer', // no-referrer, *client
      // body: JSON.stringify(data), // body data type must match 'Content-Type' header
    };

    return fetchRxjs<BinanceAccountInformation>(url, fetchOptions);
  }

  private sign(queryString: string): string {
    return crypto.createHmac('sha256', this.secret)
      .update(queryString)
      .digest('hex');
  }
}
