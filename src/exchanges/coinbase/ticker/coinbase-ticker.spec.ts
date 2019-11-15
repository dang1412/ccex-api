import { take } from 'rxjs/operators';

import { checkTicker } from '../../exchange-test.functions';
import { CoinbaseTicker } from './coinbase-ticker';

const coinbaseTicker = new CoinbaseTicker();

describe('coinbaseTicker', () => {
  jest.setTimeout(20000);

  const markets = ['btc_usd', 'eth_usd'];

  /**
   * Rest api ticker
   */
  markets.forEach((market) => {
    it(`should fetch ticker api ${market}`, async () => {
      const ticker = await coinbaseTicker.fetchTicker(market);
      checkTicker(ticker);
    });
  });

  /**
   * Realtime ticker
   */
  markets.forEach((market) => {
    it(`should get ticker realtime ${market}`, (done) => {
      coinbaseTicker
        .ticker$(market)
        .pipe(take(2))
        .subscribe(
          (ticker) => {
            checkTicker(ticker);
          },
          (e) => console.log('Error'),
          () => {
            coinbaseTicker.stopTicker(market);
            done();
          },
        );
    });
  });
});
