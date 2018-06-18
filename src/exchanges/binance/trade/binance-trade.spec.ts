import 'mocha';
import { take, bufferCount } from 'rxjs/operators';

import { checkTrades } from '../../exchange-test.functions';
import { BinanceTrade } from './binance-trade';

const binanceTrade = new BinanceTrade();

describe.only('Test Binance trades', function () {
  this.timeout(0);

  const markets = ['btc_usdt', 'eth_btc'];

  markets.forEach(market => {
    it('should get realtime trades ' + market, (done) => {
      binanceTrade.trade$(market).pipe(bufferCount(10), take(1)).subscribe(
        (trades) => {
          checkTrades(trades);
        },
        (e) => console.log('Error'),
        () => {
          binanceTrade.stopTrade(market);
          done();
        }
      );
    });
  });

  markets.forEach(market => {
    it('should fetch rest api trades ' + market, (done) => {
      binanceTrade.fetchTrades$(market, 10).subscribe(
        (trades) => {
          checkTrades(trades);
        },
        (e) => console.log('Error'),
        () => {
          done();
        }
      );
    });
  });
});
