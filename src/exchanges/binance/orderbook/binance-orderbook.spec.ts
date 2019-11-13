import { take } from 'rxjs/operators';

import { checkOrderbook } from '../../exchange-test.functions';
import { BinanceOrderbook } from './binance-orderbook';

const binanceOrderbook = new BinanceOrderbook();

describe('binanceOrderbook', () => {
  jest.setTimeout(10000);

  const markets = ['btc_usdt', 'eos_btc', 'eos_usdt'];

  markets.forEach((market) => {
    it(`should fetch orderbook ${market}`, async () => {
      const orderbook = await binanceOrderbook.fetchOrderbook(market);
      checkOrderbook(orderbook);
    });
  });

  markets.forEach((market) => {
    it(`should get orderbook realtime ${market}`, (done) => {
      binanceOrderbook
        .orderbook$(market)
        .pipe(take(2))
        .subscribe(
          (orderbook) => {
            checkOrderbook(orderbook);
          },
          () => {
            /* error */
          },
          () => {
            binanceOrderbook.stopOrderbook(market);
            done();
          },
        );
    });
  });
});
