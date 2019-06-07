 /* tslint:disable-next-line */
const apiKeys = require('../api-private/api-key-test');
import { BinanceUserStream } from './binance-user-stream';

const binanceUserStream = new BinanceUserStream(apiKeys.key);

describe('binanceUserStream', () => {
  it('should get account information realtime', (done) => {
    // TODO test binanceUserStream's userDataAccount$ method
    // binanceUserStream.userDataAccount$().subscribe(accountInfo => {
    //   console.log(accountInfo);
    //   done();
    // });
    done();
  });
});
