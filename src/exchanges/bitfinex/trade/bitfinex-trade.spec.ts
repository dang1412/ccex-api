import { bufferCount, take } from 'rxjs/operators';

import { checkTrades } from '../../exchange-test.functions';
import { BitfinexTrade } from './bitfinex-trade';
import { BitfinexWebsocket } from '../websocket';

const bitfinexWebsocket = new BitfinexWebsocket();
const bitfinexTrade = new BitfinexTrade('', bitfinexWebsocket);

describe('bitfinexTrade', () => {
  jest.setTimeout(30000);

  const markets = ['btc_usd'];

  markets.forEach((market) => {
    it(`should fetch rest api trades ${market}`, async () => {
      const trades = await bitfinexTrade.fetchTrades(market, undefined, undefined, 10, 1);
      checkTrades(trades);
    });
  });

  markets.forEach((market) => {
    it(`should get realtime trades ${market}`, (done) => {
      bitfinexTrade
        .trade$(market)
        .pipe(
          bufferCount(2),
          take(1),
        )
        .subscribe(
          (trades) => {
            checkTrades(trades);
          },
          (e) => console.log('Error'),
          () => {
            bitfinexTrade.stopTrade(market);
            bitfinexWebsocket.destroy();
            done();
          },
        );
    });
  });
});
