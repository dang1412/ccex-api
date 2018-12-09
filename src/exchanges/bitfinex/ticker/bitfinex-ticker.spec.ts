import { take } from 'rxjs/operators';

import { checkTicker } from '../../exchange-test.functions';
import { BitfinexTicker } from './bitfinex-ticker';

const bitfinexTicker = new BitfinexTicker();

describe('bitfinexTicker', () => {
  jest.setTimeout(20000);

  const markets = ['btc_usd', 'eth_usd'];
  markets.forEach((market) => {
    it(`should get ticker realtime ${market}`, (done) => {
      bitfinexTicker
        .ticker$(market)
        .pipe(take(2))
        .subscribe(
          (ticker) => {
            checkTicker(ticker);
          },
          (e) => console.log('Error'),
          () => {
            bitfinexTicker.stopTicker(market);
            done();
          },
        );
    });
  });
});
