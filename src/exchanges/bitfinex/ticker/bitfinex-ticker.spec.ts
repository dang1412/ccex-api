import 'mocha';
import { take } from 'rxjs/operators';

import { checkTicker } from '../../exchange-test.functions';
import { BitfinexTicker } from './bitfinex-ticker';

const bitfinexTicker = new BitfinexTicker();

describe('Test Bitfinex tickers', function() {
  this.timeout(0);
  const markets = ['btc_usd', 'eos_btc', 'eos_usd'];
  markets.forEach((market) => {
    it('should get ticker ' + market, (done) => {
      bitfinexTicker
        .ticker$(market)
        .pipe(take(2))
        .subscribe(
          (ticker) => {
            console.log(ticker.pair, ticker.last);
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
