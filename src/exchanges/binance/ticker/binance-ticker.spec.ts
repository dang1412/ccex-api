import { take } from 'rxjs/operators';

import { checkTicker } from '../../exchange-test.functions';
import { BinanceTicker } from './binance-ticker';

const binanceTicker = new BinanceTicker();

describe('binanceTicker', () => {
  jest.setTimeout(10000);

  const markets = ['btc_usdt', 'eos_btc', 'eos_usdt'];

  markets.forEach((market) => {
    it(`should get ticker realtime ${market}`, (done) => {
      binanceTicker
        .ticker$(market)
        .pipe(take(2))
        .subscribe(
          (ticker) => {
            checkTicker(ticker);
          },
          () => {/* error */},
          () => {
            binanceTicker.stopTicker(market);
            done();
          },
        );
    });
  });

  markets.forEach((market) => {
    it(`should fetch ticker ${market}`, (done) => {
      binanceTicker.fetchTicker$(market).subscribe(
        (ticker) => {
          checkTicker(ticker);
        },
        () => {/* error */},
        () => {
          done();
        },
      );
    });
  });
});
