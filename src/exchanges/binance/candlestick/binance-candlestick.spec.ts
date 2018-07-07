import 'mocha';
import { assert } from 'chai';

import { BinanceCandleStick } from './binance-candlestick';
import { take } from 'rxjs/operators';

const binanceCandlestick = new BinanceCandleStick();

describe('Test binance candlestick functions', function() {
  this.timeout(0);

  it('should fetch btc_usdt 5min candles in provided time range', (done) => {
    binanceCandlestick.fetchCandleStickRange$('btc_usdt', 5, 1529509826239 - 60000 * 60 * 24, 1529509826239).subscribe((candles) => {
      console.log(candles.length, candles[0]);
      assert(candles[0].close);
      done();
    });
  });

  it('should get btc_usdt 5min last candle realtime', (done) => {
    binanceCandlestick
      .candlestick$('btc_usdt', 5)
      .pipe(take(3))
      .subscribe(
        (candle) => {
          console.log(candle);
        },
        () => console.log('error'),
        () => {
          binanceCandlestick.stopCandleStick('btc_usdt');
          done();
        },
      );
  });
});
