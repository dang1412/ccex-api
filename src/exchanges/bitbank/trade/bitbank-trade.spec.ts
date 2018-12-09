import { take, bufferCount } from 'rxjs/operators';

import { checkTrades } from '../../exchange-test.functions';
import { BitbankTrade } from './bitbank-trade';

const bitbankTrade = new BitbankTrade();

describe('bitbankTrade', () => {
  jest.setTimeout(10000);
  const markets = ['btc_jpy', 'xrp_jpy'];

  markets.forEach((market) => {
    it(`should get realtime trades ${market}`, (done) => {
      bitbankTrade
        .trade$(market)
        .pipe(
          bufferCount(2),
          take(1),
        )
        .subscribe(
          (trades) => {
            checkTrades(trades);
          },
          (e) => console.log('Error'),
          () => {
            bitbankTrade.stopTrade(market);
            done();
          },
        );
    });
  });

  markets.forEach((market) => {
    it(`should fetch rest api trades ${market}`, (done) => {
      bitbankTrade.fetchTrades$(market).subscribe(
        (trades) => {
          // check trades without increase timestamp order
          checkTrades(trades, false);
        },
        (e) => console.log('Error'),
        () => {
          done();
        },
      );
    });
  });
});
