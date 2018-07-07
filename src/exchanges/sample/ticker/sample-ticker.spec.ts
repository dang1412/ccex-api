import 'mocha';

import { checkTicker } from '../../exchange-test.functions';
import { SampleTicker } from './sample-ticker';

const sampleTicker = new SampleTicker();

describe('Test Sample ticker', function() {
  const markets = [];
  markets.forEach((market) => {
    it('should fetch ticker ' + market, (done) => {
      sampleTicker.fetchTicker$(market).subscribe((ticker) => {
        console.log(ticker.pair, ticker.last);
        checkTicker(ticker);
        done();
      });
    });
  });
});
