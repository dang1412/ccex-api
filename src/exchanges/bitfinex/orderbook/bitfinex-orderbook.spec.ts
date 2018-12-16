import { take } from 'rxjs/operators';

import { checkOrderbook } from '../../exchange-test.functions';
import { BitfinexOrderbook } from './bitfinex-orderbook';
import { BitfinexWebsocket } from '../websocket';

const bitfinexWebsocket = new BitfinexWebsocket();
const bitfinexOrderbook = new BitfinexOrderbook('', bitfinexWebsocket);

describe('bitfinexOrderbook', () => {
  jest.setTimeout(30000);

  const markets = ['btc_usd'];

  markets.forEach((market) => {
    it(`should get orderbook realtime ${market}`, (done) => {
      bitfinexOrderbook
        .orderbook$(market)
        .pipe(take(4))
        .subscribe(
          (orderbook) => {
            checkOrderbook(orderbook);
          },
          (e) => console.log('Error'),
          () => {
            bitfinexOrderbook.stopOrderbook(market);
            bitfinexWebsocket.destroy();
            done();
          },
        );
    });
  });
});
