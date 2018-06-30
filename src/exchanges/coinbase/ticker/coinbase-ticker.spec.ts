import 'mocha';
import { take } from 'rxjs/operators';

import { checkTicker } from '../../exchange-test.functions';
import { CoinbaseTicker } from './coinbase-ticker';

const coinbaseTicker = new CoinbaseTicker();

describe.only('Test Coinbase tickers', function () {
  this.timeout(0);

  const markets = ['btc_usd', 'eth_usd', 'eth_btc'];

  /**
   * Rest api tickers
   */
  markets.forEach(market => {
    it('should fetch ticker ' + market, (done) => {
      coinbaseTicker.fetchTicker$(market).subscribe(
        (ticker) => {
          console.log(ticker.pair, ticker.last);
          checkTicker(ticker);
        },
        (e) => console.log('Error'),
        () => {
          done();
        }
      );
    });
  });

  /**
   * Realtime tickers
   */
  markets.forEach(market => {
    it('should listen ticker stream ' + market, (done) => {
      coinbaseTicker.ticker$(market).pipe(take(2)).subscribe(
        (ticker) => {
          console.log(ticker.pair, ticker.last);
          checkTicker(ticker);
        },
        (e) => console.log('Error'),
        () => {
          coinbaseTicker.stopTicker(market);
          done();
        }
      );
    });
  });
});
