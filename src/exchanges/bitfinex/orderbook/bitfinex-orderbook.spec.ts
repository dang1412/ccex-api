import { take } from 'rxjs/operators';

import { checkOrderbook } from '../../exchange-test.functions';
import { BitfinexOrderbook } from './bitfinex-orderbook';

const bitfinexOrderbook = new BitfinexOrderbook();

describe('bitfinexOrderbook', () => {
  jest.setTimeout(10000);

  const markets = ['btc_usd', 'eth_usd'];

  markets.forEach((market) => {
    it(`should get orderbook realtime ${market}`, (done) => {
      bitfinexOrderbook
        .orderbook$(market)
        .pipe(take(4))
        .subscribe(
          (orderbook) => {
            checkOrderbook(orderbook);
          },
          (e) => console.log('Error'),
          () => {
            bitfinexOrderbook.stopOrderbook(market);
            done();
          },
        );
    });
  });
});
