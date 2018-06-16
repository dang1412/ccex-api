import 'mocha';

import { checkTicker } from '../../exchange-test.functions';
import { CoincheckTicker } from './coincheck-ticker';

const coincheckTicker = new CoincheckTicker();

describe('Test Coincheck ticker', function () {
  const markets = ['btc_jpy'];
  markets.forEach(market => {
    it('should fetch ticker ' + market, (done) => {
      coincheckTicker.fetchTicker$(market).subscribe((ticker) => {
        console.log(ticker.pair, ticker.last);
        checkTicker(ticker);
        done();
      });
    });
  });
});