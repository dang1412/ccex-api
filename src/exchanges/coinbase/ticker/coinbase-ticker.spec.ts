import 'mocha';
import { take } from 'rxjs/operators';

import { checkTicker } from '../exchange-test.functions';
import { CoinbaseTicker } from './coinbase-ticker';
import { CoinbaseWebsocket } from './coinbase-websocket';
import { wsEndpoint } from './coinbase-functions';

const coinbaseWebsocket = new CoinbaseWebsocket(wsEndpoint);
const coinbaseTicker = new CoinbaseTicker(coinbaseWebsocket);

describe('Test Coinbase tickers', function () {
  this.timeout(0);

  const markets = ['btc_usd', 'eth_usd', 'eth_btc'];
  markets.forEach(market => {
    it('should get ticker ' + market, (done) => {
      coinbaseTicker.ticker$(market).pipe(take(2)).subscribe(
        (ticker) => {
          console.log(ticker.pair, ticker.last);
          checkTicker(ticker);
        },
        (e) => console.log('Error'),
        () => {
          coinbaseTicker.stopTicker(market);
          done();
        }
      );
    });
  });
});
