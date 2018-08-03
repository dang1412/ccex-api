import 'mocha';
import { bufferCount, take } from 'rxjs/operators';

import { checkTrades } from '../../exchange-test.functions';
import { CoinbaseTrade } from './coinbase-trade';

const coinbaseTrade = new CoinbaseTrade();

describe('Coinbase trade functions', function() {
  this.timeout(0);

  const markets = ['btc_usd'];

  /**
   * Rest api trades
   */
  markets.forEach((market) => {
    it('should fetch rest api trades ' + market, (done) => {
      coinbaseTrade.fetchTrades$(market).subscribe(
        (trades) => {
          checkTrades(trades, false);
        },
        (e) => console.log('Error'),
        () => {
          done();
        },
      );
    });
  });

  /**
   * Realtime trade
   */
  markets.forEach((market) => {
    it('should get realtime trades ' + market, (done) => {
      coinbaseTrade
        .trade$(market)
        .pipe(
          bufferCount(5),
          take(1),
        )
        .subscribe(
          (trades) => {
            checkTrades(trades);
          },
          (e) => console.log('Error'),
          () => {
            coinbaseTrade.stopTrade(market);
            done();
          },
        );
    });
  });
});
