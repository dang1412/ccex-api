import { bufferCount, take } from 'rxjs/operators';

import { checkTrades } from '../../exchange-test.functions';
import { BitmexTrade } from './bitmex-trade';
import { BitmexWebsocket } from '../websocket';

const bitmexWebsocket = new BitmexWebsocket();
const bitmexTrade = new BitmexTrade('', bitmexWebsocket);

describe('bitfinexTrade', () => {
  jest.setTimeout(30000);

  const markets = ['xbt_usd'];

  markets.forEach((market) => {
    it(`should get realtime trades ${market}`, (done) => {
      bitmexTrade
        .trade$(market)
        .pipe(
          bufferCount(5),
          take(1),
        )
        .subscribe(
          (trades) => {
            checkTrades(trades);
          },
          (e) => console.log('Error'),
          () => {
            bitmexTrade.stopTrade(market);
            bitmexWebsocket.destroy();
            done();
          },
        );
    });
  });
});
