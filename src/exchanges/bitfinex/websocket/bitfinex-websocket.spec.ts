import { BitfinexWebsocket } from './bitfinex-websocket';
import { MOCK_SOCKET } from './test-helpers';
import { BitfinexRawTicker } from './bitfinex-websocket.type';
import { take } from 'rxjs/operators';

const bitfinexWebsocket = new BitfinexWebsocket('', () => MOCK_SOCKET as any);

describe('bitfinexWebsocket', () => {
  it('should subscribe', async () => {
    const raw = await bitfinexWebsocket
      .subscribe<BitfinexRawTicker>({channel: 'ticker',symbol: 'tBTCUSD'}).pipe(take(1)).toPromise();

    expect(raw).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  });

  it('should unsubscribe', (done) => {
    bitfinexWebsocket
      .subscribe<BitfinexRawTicker>({ channel: 'ticker', symbol: 'tBTCUSD' }).subscribe(
        () => {},
        (e) => {},
        () => { done() },
      );

    bitfinexWebsocket.unsubscribe({ channel: 'ticker', symbol: 'tBTCUSD' });
  });
});
