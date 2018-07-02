import 'mocha';
import { take } from 'rxjs/operators';

import { checkOrderbook } from '../../exchange-test.functions';
import { CoinbaseOrderbook } from './coinbase-orderbook';

const coinbaseOrderbook = new CoinbaseOrderbook();

describe('Test Coinbase orderbook', function () {
  this.timeout(0);

  const markets = ['btc_usd', 'eth_usd'];

  /**
   * Rest api orderbook
   */
  markets.forEach(market => {
    it('should fetch orderbook api ' + market, (done) => {
      coinbaseOrderbook.fetchOrderbook$(market).subscribe(
        (orderbook) => {
          console.log(orderbook.asks[0], orderbook.bids[0]);
          checkOrderbook(orderbook);
        },
        (e) => console.log('Error'),
        () => {
          done();
        }
      );
    });
  });

  /**
   * Realtime orderbook
   */
  markets.forEach((market) => {
    it('should listen orderbook realtime ' + market, (done) => {
      coinbaseOrderbook.orderbook$(market).pipe(take(4)).subscribe(
        (orderbook) => {
          console.log(orderbook.asks[0], orderbook.bids[0]);
          checkOrderbook(orderbook);
        },
        (e) => console.log('Error'),
        () => {
          coinbaseOrderbook.stopOrderbook(market);
          done();
        }
      );
    });
  });
});
