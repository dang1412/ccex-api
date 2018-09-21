import apiKey from '../api-key-test.json';
import { BinanceApiPrivate } from './binance-api-private';
import { BinanceApiPrivateSigned } from './binance-api-private-signed';
import { checkBinanceAccountInformation } from './internal/functions-test';

const binanceApiPrivateSigned = new BinanceApiPrivateSigned(apiKey.key, apiKey.secret);
const binanceApiPrivate = new BinanceApiPrivate(apiKey.key);

describe('Test binance api private functions', () => {
  it('Should fetch account information', (done) => {
    binanceApiPrivateSigned.getAccountInformation().subscribe(accountInfo => {
      checkBinanceAccountInformation(accountInfo);
      done();
    });
  });

  it('Should fetch user data stream listen key', (done) => {
    binanceApiPrivate.getUserStreamListenKey$().subscribe(listenKey => {
      expect(listenKey);
      done();
    });
  });
});
