import { bufferCount, take } from 'rxjs/operators';

import { checkTrades } from '../../exchange-test.functions';
import { CoinbaseTrade } from './coinbase-trade';

const coinbaseTrade = new CoinbaseTrade();

describe('coinbaseTrade', () => {
  jest.setTimeout(20000);

  const markets = ['btc_usd'];

  /**
   * Rest api trades
   */
  markets.forEach((market) => {
    it(`should fetch rest api trades ${market}`, async () => {
      const trades = await coinbaseTrade.fetchTrades(market);
      checkTrades(trades, false);
    });
  });

  /**
   * Realtime trade
   */
  markets.forEach((market) => {
    it(`should get realtime trades ${market}`, (done) => {
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
