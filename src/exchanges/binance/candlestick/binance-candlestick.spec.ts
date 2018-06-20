import 'mocha';
import { assert } from 'chai';

import { BinanceCandleStick } from './binance-candlestick';

const binanceCandlestick = new BinanceCandleStick();

describe.only('Test binance candlestick functions', () => {
  it('should get btc_jpy 5min candles', (done) => {
    binanceCandlestick.fetchCandleStickRange$('btc_usdt', 15, 1529509826239 - 60000 * 60 * 24, 1529509826239).subscribe((candles) => {
      console.log(candles.length, candles[0]);
      assert(candles[0].close);
      done();
    });
  });
});
