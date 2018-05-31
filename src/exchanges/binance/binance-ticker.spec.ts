import 'mocha';
// import { assert } from 'chai';
import { take } from 'rxjs/operators';

import { checkTicker } from '../exchange-test.functions';
import { BinanceTicker } from './binance-ticker';

const binanceTicker = new BinanceTicker();

describe('Test Binance ticker', function() {
  this.timeout(0);
  const markets = ['btc_usdt', 'eos_btc', 'eos_usdt'];
  markets.forEach(market => {
    it('should get ticker ' + market, (done) => {
      binanceTicker.ticker$(market).pipe(take(2)).subscribe(
        (ticker) => {
          checkTicker(ticker);
        },
        (e) => console.log('Error'),
        () => {
          done();
        }
      );
    });
  });
});
