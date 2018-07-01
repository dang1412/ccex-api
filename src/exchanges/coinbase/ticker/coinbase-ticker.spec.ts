import 'mocha';
import { take } from 'rxjs/operators';

import { checkTicker } from '../../exchange-test.functions';
import { CoinbaseTicker } from './coinbase-ticker';

const coinbaseTicker = new CoinbaseTicker();

describe('Test Coinbase tickers', function () {
  this.timeout(0);

  const markets = ['btc_usd', 'eth_usd', 'eth_btc'];

  /**
   * Rest api ticker
   */
  markets.forEach(market => {
    it('should fetch ticker api' + market, (done) => {
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
   * Realtime ticker
   */
  markets.forEach(market => {
    it('should listen ticker realtime ' + market, (done) => {
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
