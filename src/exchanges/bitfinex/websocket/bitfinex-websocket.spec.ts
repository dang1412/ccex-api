import { BitfinexWebsocket } from './bitfinex-websocket';
import { MOCK_SOCKET } from './test-helpers';
import { BitfinexRawTickerI } from './bitfinex-websocket.type';
import { take } from 'rxjs/operators';

const bitfinexWebsocket = new BitfinexWebsocket();
(bitfinexWebsocket as any).ws = MOCK_SOCKET;

describe('bitfinexWebsocket', () => {
  it('should subscribe', async () => {
    const data$ = bitfinexWebsocket
      .subscribeChannel<BitfinexRawTickerI>({ channel: 'ticker', symbol: 'tBTCUSD' });

    const raw = await data$.pipe(take(1)).toPromise();
    await bitfinexWebsocket.unsubscribeChannel({ channel: 'ticker', symbol: 'tBTCUSD' });

    expect(raw).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  });

  it('should unsubscribe', async (done) => {
    const data$ = bitfinexWebsocket
      .subscribeChannel<BitfinexRawTickerI>({ channel: 'ticker', symbol: 'tBTCUSD' });

    data$.subscribe(
      () => {},
      (e) => {},
      () => {
        done();
      },
    );

    await bitfinexWebsocket.unsubscribeChannel({ channel: 'ticker', symbol: 'tBTCUSD' });
  });
});
