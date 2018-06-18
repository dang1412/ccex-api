import 'mocha';
import { take } from 'rxjs/operators';

import { checkOrderbook } from '../../exchange-test.functions';
import { BinanceOrderbook } from './binance-orderbook';

const binanceOrderbook = new BinanceOrderbook();

describe('Test Binance orderbook', function () {
  this.timeout(0);

  const markets = ['btc_usdt', 'eos_btc', 'eos_usdt'];

  markets.forEach((market) => {
    it('should fetch orderbook ' + market, (done) => {
      binanceOrderbook.fetchOrderbook$(market).subscribe(
        (orderbook) => {
          console.log(orderbook.asks[0], orderbook.bids[0]);
          checkOrderbook(orderbook);
        },
        (e) => console.log('Error'),
        () => {
          binanceOrderbook.stopOrderbook(market);
          done();
        }
      );
    });
  });

  markets.forEach((market) => {
    it('should get orderbook realtime ' + market, (done) => {
      binanceOrderbook.orderbook$(market).pipe(take(4)).subscribe(
        (orderbook) => {
          console.log(orderbook.asks[0], orderbook.bids[0]);
          checkOrderbook(orderbook);
        },
        (e) => console.log('Error'),
        () => {
          binanceOrderbook.stopOrderbook(market);
          done();
        }
      );
    });
  });
});
