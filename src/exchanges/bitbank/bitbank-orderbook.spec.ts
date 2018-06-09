import 'mocha';
import { take } from 'rxjs/operators';

import { checkOrderbook } from '../exchange-test.functions';
import { BitbankOrderbook } from './bitbank-orderbook';

const bitbankOrderbook = new BitbankOrderbook();

describe('Test Bitbank orderbook', function () {
  this.timeout(0);
  const markets = ['btc_jpy', 'xrp_jpy'];
  markets.forEach(market => {
    it('should get depth ' + market, (done) => {
      bitbankOrderbook.orderbook$(market).pipe(take(2)).subscribe(
        (orderbook) => {
          console.log(orderbook.asks[0], orderbook.bids[0]);
          checkOrderbook(orderbook);
        },
        (e) => console.log('Error'),
        () => {
          bitbankOrderbook.stopOrderbook(market);
          done();
        }
      );
    });
  });
});
