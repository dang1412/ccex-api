import { checkTicker } from '../../exchange-test.functions';
import { BinanceTicker } from './binance-ticker';

import { MOCK_SOCKET } from './test-helpers';

const pair = 'btc_usdt';

describe('binanceTicker', () => {
  const binanceTicker = new BinanceTicker(pair, p => MOCK_SOCKET as any);
  it(`should get ticker realtime ${pair}`, (done) => {
    binanceTicker
      .getStream$()
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
