import { BitbankCandlestick } from './bitbank-candlestick';

const bitbankCandlestick = new BitbankCandlestick();

describe('Test bitbank-candlestick functions', () => {
  it('should get btc_jpy 5min candles', (done) => {
    bitbankCandlestick.fetchCandleStickRange$('btc_jpy', 5, 1526917534904, 1526917534904).subscribe((candles) => {
      expect(candles.length).toBe(1);
      expect(candles[0].close).toBe(937642);
      done();
    });
  });

  it('should get approximate history price', (done) => {
    bitbankCandlestick.getApproximateHistoryPrice('btc_jpy', 1526917534904, 1).subscribe((price) => {
      expect(price).toBe(935270);
      done();
    });
  });
});
