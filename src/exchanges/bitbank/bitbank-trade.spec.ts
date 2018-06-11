import 'mocha';
import { take } from 'rxjs/operators';

// import { checkOrderbook } from '../exchange-test.functions';
import { BitbankTrade } from './bitbank-trade';

const bitbankTrade = new BitbankTrade();

describe('Test Bitbank trades', function () {
  this.timeout(0);
  const markets = ['btc_jpy', 'xrp_jpy'];
  markets.forEach(market => {
    it('should get trades ' + market, (done) => {
      // bitbankTrade.trades$(market).subscribe(trades => console.log(trades));
      bitbankTrade.trade$(market).pipe(take(10)).subscribe(
        (trade) => {
          console.log(trade.timestamp);
          // checkOrderbook(orderbook);
        },
        (e) => console.log('Error'),
        () => {
          bitbankTrade.stopTrade(market);
          done();
        }
      );
    });
  });
});
