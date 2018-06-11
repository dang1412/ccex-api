import 'mocha';
import { assert } from 'chai';

import { BitbankCandlestick } from './bitbank-candlestick';

const bitbankCandlestick = new BitbankCandlestick();

describe('Test bitbank-candlestick functions', () => {
  it('should get btc_jpy 5min candles', (done) => {
    bitbankCandlestick.fetchCandleStickRange$('btc_jpy', 5, 1526917534904, 1526917534904).subscribe((candles) => {
      console.log(candles.length, candles[0]);
      assert(candles.length === 288);
      assert(candles[0].close);
      done();
    });
  });

  it('should get approximate history price', (done) => {
    bitbankCandlestick.getApproximateHistoryPrice('btc_jpy', 1526917534904, 1).subscribe((price) => {
      console.log('Got price', price);
      assert(price && price === 935270);
      done();
    })
  });
});
