import { BitbankCandlestick } from './bitbank-candlestick';

const bitbankCandlestick = new BitbankCandlestick();

describe('Test bitbank candlestick functions', () => {
  it('should get btc_jpy 5min candles', async () => {
    const candles = await bitbankCandlestick.fetchCandleStickRange('btc_jpy', 5, 1526917534904, 1526917534904);
    expect(candles.length).toBe(1);
    expect(candles[0].close).toBe(937642);
  });

  it('should get approximate history price', async () => {
    const price = await bitbankCandlestick.getApproximateHistoryPrice('btc_jpy', 1526917534904, 1);
    expect(price).toBe(935270);
  });
});
