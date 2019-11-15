import { take } from 'rxjs/operators';

import { checkOrderbook } from '../../exchange-test.functions';
import { CoinbaseOrderbook } from './coinbase-orderbook';

const coinbaseOrderbook = new CoinbaseOrderbook();

describe('coinbaseOrderbook', () => {
  jest.setTimeout(10000);

  const markets = ['btc_usd', 'eth_usd'];

  /**
   * Rest api orderbook
   */
  markets.forEach((market) => {
    it(`should fetch orderbook api ${market}`, async () => {
      const orderbook = await coinbaseOrderbook.fetchOrderbook(market);
      checkOrderbook(orderbook);
    });
  });

  /**
   * Realtime orderbook
   */
  markets.forEach((market) => {
    it(`should listen orderbook realtime ${market}`, (done) => {
      coinbaseOrderbook
        .orderbook$(market)
        .pipe(take(3))
        .subscribe(
          (orderbook) => {
            checkOrderbook(orderbook);
          },
          (e) => console.log('Error'),
          () => {
            coinbaseOrderbook.stopOrderbook(market);
            done();
          },
        );
    });
  });
});
