import { take } from 'rxjs/operators';

import { checkOrderbook } from '../../exchange-test.functions';
import { BitmexOrderbook } from './bitmex-orderbook';
import { BitmexWebsocket } from '../websocket';

const bitmexWebsocket = new BitmexWebsocket();
const bitmexOrderbook = new BitmexOrderbook('', bitmexWebsocket);

describe('bitmexOrderbook', () => {
  jest.setTimeout(30000);

  const markets = ['xbt_usd'];

  markets.forEach((market) => {
    it(`should get orderbook realtime ${market}`, (done) => {
      bitmexOrderbook
        .orderbook$(market)
        .pipe(take(4))
        .subscribe(
          (orderbook) => {
            checkOrderbook(orderbook);
          },
          (e) => console.log('Error'),
          () => {
            bitmexOrderbook.stopOrderbook(market);
            bitmexWebsocket.destroy();
            done();
          },
        );
    });
  });
});
