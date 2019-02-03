import { take } from 'rxjs/operators';

import { checkTicker } from '../../exchange-test.functions';
import { BinanceTicker } from './binance-ticker';

import { MOCK_SOCKET } from './test-helpers';

describe('binanceTicker', () => {
  jest.setTimeout(10000);

  const pairs = ['btc_usdt'];

  pairs.forEach((pair) => {
    const binanceTicker = new BinanceTicker(pair, p => MOCK_SOCKET);
    it(`should get ticker realtime ${pair}`, (done) => {
      binanceTicker
        .getStream$()
        // .pipe(take(2))
        .subscribe(
          (ticker) => {
            console.log('ticker ==>', ticker);
            checkTicker(ticker);
          },
          () => {/* error */},
          () => {
            binanceTicker.stop();
            done();
          },
        );
    });

    it(`should fetch ticker ${pair}`, (done) => {
      binanceTicker.fetch$().subscribe(
        (ticker) => {
          checkTicker(ticker);
        },
        () => {/* error */ },
        () => {
          done();
        },
      );
    });
  });
});
