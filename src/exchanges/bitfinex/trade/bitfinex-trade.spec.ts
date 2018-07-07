import 'mocha';
import { bufferCount, take } from 'rxjs/operators';

import { checkTrades } from '../../exchange-test.functions';
import { BitfinexTrade } from './bitfinex-trade';

const bitfinexTrade = new BitfinexTrade();

describe('Test Bitfinex trades', function() {
  this.timeout(0);

  const markets = ['btc_usd', 'eth_btc'];

  markets.forEach((market) => {
    it('should fetch rest api trades ' + market, (done) => {
      bitfinexTrade.fetchTrades$(market, null, null, 10, 1).subscribe(
        (trades) => {
          console.log(trades);
          checkTrades(trades);
        },
        (e) => console.log('Error'),
        () => {
          done();
        },
      );
    });
  });

  markets.forEach((market) => {
    it('should get realtime trades ' + market, (done) => {
      bitfinexTrade
        .trade$(market)
        .pipe(
          bufferCount(5),
          take(1),
        )
        .subscribe(
          (trades) => {
            console.log('trades ===>', trades);
            checkTrades(trades);
          },
          (e) => console.log('Error'),
          () => {
            bitfinexTrade.stopTrade(market);
            done();
          },
        );
    });
  });
});
