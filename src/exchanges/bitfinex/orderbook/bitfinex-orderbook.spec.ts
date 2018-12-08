import { take } from 'rxjs/operators';

import { checkOrderbook } from '../../exchange-test.functions';
import { BitfinexOrderbook } from './bitfinex-orderbook';

const bitfinexOrderbook = new BitfinexOrderbook();

describe('bitfinexOrderbook', () => {
  jest.setTimeout(30000);

  const markets = ['btc_usd', 'eos_btc', 'eth_btc'];

  markets.forEach((market) => {
    it(`should get orderbook realtime ${market}`, (done) => {
      bitfinexOrderbook
        .orderbook$(market)
        .pipe(take(4))
        .subscribe(
          (orderbook) => {
            console.log(orderbook.asks[0], orderbook.bids[0]);
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
