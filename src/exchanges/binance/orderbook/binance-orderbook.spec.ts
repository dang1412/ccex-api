import { take } from 'rxjs/operators';

import { checkOrderbook } from '../../exchange-test.functions';
import { BinanceOrderbook } from './binance-orderbook';
import { BinanceWebsocket } from '../websocket';

describe('binanceOrderbook', () => {
  jest.setTimeout(10000);

  const binanceWebsocket = new BinanceWebsocket();
  const binanceOrderbook = new BinanceOrderbook(binanceWebsocket);

  const markets = ['btc_usdt', 'eos_btc', 'eos_usdt'];

  markets.forEach((market) => {
    it(`should fetch orderbook ${market}`, async () => {
      const orderbook = await binanceOrderbook.fetch(market);
      checkOrderbook(orderbook);
    });
  });

  markets.forEach((market) => {
    it(`should get orderbook realtime ${market}`, (done) => {
      binanceOrderbook
        .stream$(market)
        .pipe(take(2))
        .subscribe(
          (orderbook) => {
            console.log(orderbook.asks[0]);
            checkOrderbook(orderbook);
          },
          () => {
            /* error */
          },
          () => {
            binanceOrderbook.stopOrderbook(market);
            done();
          },
        );
    });
  });
});
