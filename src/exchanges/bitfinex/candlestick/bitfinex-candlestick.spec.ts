import { take } from 'rxjs/operators';

import { checkCandleStick } from '../../exchange-test.functions';
import { BitfinexCandleStick } from './bitfinex-candlestick';

const bitfinexCandlestick = new BitfinexCandleStick();

describe('Test bitfinex candlestick functions', () => {
  it('should fetch btc_usd 5min candles in time range', (done) => {
    bitfinexCandlestick.fetchCandleStickRange$('btc_usd', 5, 1529509826239 - 60000 * 60 * 24, 1529509826239).subscribe((candles) => {
      checkCandleStick(candles[0]);
      done();
    });
  });

  it('should get btc_usd 5min last candle realtime', (done) => {
    bitfinexCandlestick
      .candlestick$('btc_usd', 5)
      .pipe(take(5))
      .subscribe(
        (candle) => {
          checkCandleStick(candle);
        },
        () => console.log('error'),
        () => {
          bitfinexCandlestick.stopCandleStick('btc_usd', 5);
          done();
        },
      );
  });
});
