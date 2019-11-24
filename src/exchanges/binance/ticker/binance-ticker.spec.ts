import { take } from 'rxjs/operators';

import { checkTicker } from '../../exchange-test.functions';
import { BinanceTicker } from './binance-ticker';

import { MOCK_SOCKET } from './test-helpers';
import { BinanceWebsocket } from '../websocket';

const pair = 'btc_usdt';

describe('binanceTicker', () => {
  const binanceWebsocket = new BinanceWebsocket();
  (binanceWebsocket as any).ws = MOCK_SOCKET;

  const binanceTicker = new BinanceTicker(binanceWebsocket);

  it(`should fetch ticker ${pair}`, async () => {
    const ticker = await binanceTicker.fetch(pair);
    checkTicker(ticker);
  });

  it(`should get ticker realtime ${pair}`, async () => {
    const ticker = await binanceTicker.stream$(pair).pipe(take(1)).toPromise();
    checkTicker(ticker);

    binanceTicker.stop(pair);
  });
});
