import { take } from 'rxjs/operators';

import { checkTicker } from '../../exchange-test.functions';
import { BitbankTicker } from './bitbank-ticker';

const bitbankTicker = new BitbankTicker();

describe('bitbankTicker', () => {
  jest.setTimeout(10000);

  const markets = ['btc_jpy', 'xrp_jpy'];

  markets.forEach((market) => {
    it(`should get ticker realtime ${market}`, (done) => {
      bitbankTicker
        .ticker$(market)
        .pipe(take(2))
        .subscribe(
          (ticker) => {
            checkTicker(ticker);
          },
          () => {
            /* error */
          },
          () => {
            bitbankTicker.stopTicker(market);
            done();
          },
        );
    });
  });

  markets.forEach((market) => {
    it(`should fetch ticker ${market}`, async () => {
      const ticker = await bitbankTicker.fetchTicker(market);
      checkTicker(ticker);
    });
  });
});
