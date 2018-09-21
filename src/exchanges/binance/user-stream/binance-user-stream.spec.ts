import apiKey from '../api-key-test.json';
import { BinanceUserStream } from './binance-user-stream';

const binanceUserStream = new BinanceUserStream(apiKey.key);

describe('Test binance user stream functions', () => {
  it('Should get account information realtime', (done) => {
    binanceUserStream.userDataAccount$().subscribe(accountInfo => {
      console.log(accountInfo);
      done();
    });
  });
});
