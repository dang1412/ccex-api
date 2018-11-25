import { apiKeys } from '../../src/exchanges/binance/api-key-test';
import { BinanceUserStream } from '../../src/exchanges/binance/user-stream/binance-user-stream';

const binanceUserStream = new BinanceUserStream(apiKeys.key);

binanceUserStream.userDataAccount$().subscribe(accountInfo => {
  console.log(accountInfo);
});
