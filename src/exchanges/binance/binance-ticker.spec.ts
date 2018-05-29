import 'mocha';
// import { assert } from 'chai';
import { take } from 'rxjs/operators';

import { BinanceTicker } from './binance-ticker';


const binanceTicker = new BinanceTicker();

describe.only('Test Binance ticker', function() {
  this.timeout(0);
  it('should get btc_usd ticker', (done) => {
    binanceTicker.ticker$('btc_usdt').pipe(take(2)).subscribe(
      (ticker) => {
        console.log(ticker);
      }),
      (e) => {},
      () => {
        console.log('Done');
        done();
      }
  });
});
