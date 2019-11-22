import { take } from 'rxjs/operators';

import { checkTicker } from '../../exchange-test.functions';
import { BitfinexTicker } from './bitfinex-ticker';
import { BitfinexWebsocket } from '../websocket';
import { MOCK_SOCKET } from './test-helpers';

const bitfinexWebsocket = new BitfinexWebsocket();
const bitfinexTicker = new BitfinexTicker('', bitfinexWebsocket);

const pair = 'btc_usd';

describe('bitfinexTicker', () => {
  jest.setTimeout(30000);

  it(`should fetch ticker ${pair}`, async () => {
    const ticker = await bitfinexTicker.fetchTicker(pair);
    checkTicker(ticker);
  });

  it(`should get ticker realtime ${pair}`, (done) => {
    bitfinexTicker
      .ticker$(pair)
      .pipe(take(1))
      .subscribe(
        (ticker) => {
          checkTicker(ticker);
        },
        (e) => console.log('Error'),
        async () => {
          await bitfinexTicker.stopTicker(pair);
          bitfinexWebsocket.destroy();
          done();
        },
      );
  });
});
