import { checkCandleStick } from '../../exchange-test.functions';
import { BitmexCandleStick } from './bitmex-candlestick';

const bitmexCandlestick = new BitmexCandleStick();

describe('bitmexCandlestick', () => {
  jest.setTimeout(30000);

  it('should fetch xbt_usd 5min candles in time range', (done) => {
    bitmexCandlestick.fetchCandleStickRange$('xbt_usd', 5, 1529509826239 - 60000 * 60 * 24, 1529509826239).subscribe((candles) => {
      checkCandleStick(candles[0]);
      done();
    });
  });
});
