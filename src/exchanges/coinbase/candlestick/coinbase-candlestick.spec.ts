import { checkCandleStick } from '../../exchange-test.functions';
import { CoinbaseCandleStick } from './coinbase-candlestick';

const coinbaseCandlestick = new CoinbaseCandleStick();

describe('coinbaseCandlestick', () => {
  /**
   * Rest api candlestick
   */
  it('should fetch btc_usd 5min candles in provided time range', async () => {
    const candles = await coinbaseCandlestick.fetchCandleStickRange('btc_usd', 5);
    checkCandleStick(candles[0]);
  });
});
