import 'mocha';
// import { expect } from 'chai';

import { Bitbank } from './bitbank';
import { BitbankCandlestick } from './bitbank-candlestick';

const bitbankCandlestick = new BitbankCandlestick(new Bitbank());

describe('Test bitbank-candlestick functions', () => {
  it('should get btc_jpy 5min candles properly', (done) => {
    bitbankCandlestick.fetchCandleStickRange$('btc_jpy', 5, 1526917534904, 1526917534904).subscribe((candles) => {

      console.log(candles.length, candles[0]);
      done();
    });
  });
});
