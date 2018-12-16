import { take } from 'rxjs/operators';

import { checkTicker } from '../../exchange-test.functions';
import { BitfinexTicker } from './bitfinex-ticker';
import { BitfinexWebsocket } from '../websocket';

const bitfinexWebsocket = new BitfinexWebsocket();
const bitfinexTicker = new BitfinexTicker('', bitfinexWebsocket);

describe('bitfinexTicker', () => {
  jest.setTimeout(30000);

  const markets = ['btc_usd'];
  markets.forEach((market) => {
    it(`should get ticker realtime ${market}`, (done) => {
      bitfinexTicker
        .ticker$(market)
        .pipe(take(2))
        .subscribe(
          (ticker) => {
            checkTicker(ticker);
          },
          (e) => console.log('Error'),
          () => {
            bitfinexTicker.stopTicker(market);
            bitfinexWebsocket.destroy();
            done();
          },
        );
    });
  });
});
