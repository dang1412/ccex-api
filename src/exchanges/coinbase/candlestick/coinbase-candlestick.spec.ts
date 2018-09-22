import { checkCandleStick } from '../../exchange-test.functions';
import { CoinbaseCandleStick } from './coinbase-candlestick';

const coinbaseCandlestick = new CoinbaseCandleStick();

describe('Coinbase candlestick functions', () => {
  /**
   * Rest api candlestick
   */
  it('should fetch btc_usd 5min candles in provided time range', (done) => {
    coinbaseCandlestick.fetchCandleStickRange$('btc_usd', 5).subscribe((candles) => {
      checkCandleStick(candles[0]);
      done();
    });
  });
});
