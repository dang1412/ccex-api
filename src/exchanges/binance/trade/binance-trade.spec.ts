import { take, bufferCount } from 'rxjs/operators';

import { checkTrades } from '../../exchange-test.functions';
import { BinanceTrade } from './binance-trade';
import { BinanceWebsocket } from '../websocket';

describe('binanceTrade', () => {
  jest.setTimeout(20000);

  const binanceWebsocket = new BinanceWebsocket();
  const binanceTrade = new BinanceTrade(binanceWebsocket);

  const markets = ['btc_usdt', 'eth_btc'];

  markets.forEach((market) => {
    it(`should fetch rest api trades ${market}`, async () => {
      const trades = await binanceTrade.fetch(market, 10);
      checkTrades(trades);
    });
  });

  markets.forEach((market) => {
    it(`should get realtime trades ${market}`, (done) => {
      binanceTrade
        .stream$(market)
        .pipe(
          bufferCount(10),
          take(1),
        )
        .subscribe(
          (trades) => {
            checkTrades(trades);
          },
          () => {
            /* error */
          },
          () => {
            binanceTrade.stop(market);
            done();
          },
        );
    });
  });
});
