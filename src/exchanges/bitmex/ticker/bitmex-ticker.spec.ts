import { checkTicker } from '../../exchange-test.functions';
import { BitmexTicker } from './bitmex-ticker';

const bitmexTicker = new BitmexTicker();

describe('bitmexTicker', () => {
  const markets = ['btc_jpy'];
  markets.forEach((market) => {
    it(`should fetch ticker ${market}`, (done) => {
      bitmexTicker.fetchTicker$(market).subscribe((ticker) => {
        console.log(ticker.pair, ticker.last);
        checkTicker(ticker);
        done();
      });
    });
  });
});
