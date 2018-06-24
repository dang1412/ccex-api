import 'mocha';
import { assert } from 'chai';
import { take } from 'rxjs/operators';

import { BitfinexCandleStick } from './bitfinex-candlestick';

const bitfinexCandlestick = new BitfinexCandleStick();

describe.only('Test bitfinex candlestick functions', function () {
  this.timeout(0);

  it('should fetch btc_usd 5min candles in time range', (done) => {
    bitfinexCandlestick.fetchCandleStickRange$('btc_usd', 5, 1529509826239 - 60000 * 60 * 24, 1529509826239).subscribe((candles) => {
      console.log(candles.length, candles[0]);
      assert(candles[0].close);
      done();
    });
  });

  it('should get btc_usd 5min last candle realtime', (done) => {
    bitfinexCandlestick.candlestick$('btc_usd', 5).pipe(take(15)).subscribe(
      (candle) => {
        console.log(candle);
      },
      () => console.log('error'),
      () => {
        bitfinexCandlestick.stopCandleStick('btc_usd', 5);
        done();
      }
    )
  });
});
