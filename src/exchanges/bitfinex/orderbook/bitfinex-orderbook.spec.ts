import { take } from 'rxjs/operators';

import { checkOrderbook } from '../../exchange-test.functions';
import { BitfinexOrderbook } from './bitfinex-orderbook';
import { BitfinexWebsocket } from '../websocket';
import { MOCK_SOCKET } from './test-helpers';

const bitfinexWebsocket = new BitfinexWebsocket(MOCK_SOCKET as any);
const bitfinexOrderbook = new BitfinexOrderbook('', bitfinexWebsocket);

describe('bitfinexOrderbook', () => {
  jest.setTimeout(30000);

  const markets = ['btc_usd'];

  markets.forEach((market) => {
    it(`should get orderbook realtime ${market}`, (done) => {
      bitfinexOrderbook
        .orderbook$(market)
        .pipe(take(3))
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
