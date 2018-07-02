import 'mocha';
import { assert } from 'chai';

import { CoinbaseCandleStick } from './coinbase-candlestick';

const coinbaseCandlestick = new CoinbaseCandleStick();

describe('Coinbase candlestick functions', function () {
  this.timeout(0);

  /**
   * Rest api candlestick
   */
  it('should fetch btc_usd 5min candles in provided time range', (done) => {
    coinbaseCandlestick.fetchCandleStickRange$('btc_usd', 5).subscribe((candles) => {
      console.log(candles.length, candles[0]);
      assert(candles[0].close);
      done();
    });
  });
});
