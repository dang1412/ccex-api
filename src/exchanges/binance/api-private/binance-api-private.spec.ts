import { BinanceApiPrivate } from './binance-api-private';
import { checkBinanceAccountInformation } from './internal/functions-test';
import * as apiKey from './api-key-test.json';

const binanceApiPrivate = new BinanceApiPrivate(apiKey.key, apiKey.secret);

describe('Test binance api private functions', () => {
  it('Should fetch account information', (done) => {
    binanceApiPrivate.getAccountInformation().subscribe(accountInfo => {
      checkBinanceAccountInformation(accountInfo);
      done();
    });
  });
});
