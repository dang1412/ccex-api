import 'mocha';
import { expect } from 'chai';

import { Ticker } from './exchange.type';
import { ExchangeApi } from './exchange-api.abstract';

export class ExchangeApiTest {
  private exchange: ExchangeApi;

  constructor(exchange: ExchangeApi) {
    this.exchange = exchange;
  }

  run() {
    describe('Test exchange functions', () => {
      it('should get xrp_jpy ticker realtime properly', (done) => {
        const pair = 'xrp_jpy';
        let count = 0;
        const sub = this.exchange.ticker$(pair).subscribe(ticker => {
          console.log('Got btc_jpy ticker =>', ticker);
          count++;
          expect(checkTicker(ticker)).to.true;

          if (count === 2) {
            this.exchange.stopTicker(pair);
            sub.unsubscribe();
            done();
          }
        })
      });
    });
  }
}

function checkTicker(ticker: Ticker): boolean {
  return ticker
    && typeof ticker.last === 'number'
    && typeof ticker.low === 'number'
    && typeof ticker.high === 'number';
}
