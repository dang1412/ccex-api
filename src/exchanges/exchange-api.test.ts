import 'mocha';
import { take } from 'rxjs/operators';

import { ExchangeApi } from './exchange-api.abstract';
import { checkTicker } from './exchange-test.functions';

export class ExchangeApiTest {
  private exchange: ExchangeApi;

  constructor(exchange: ExchangeApi) {
    this.exchange = exchange;
  }

  run() {
    testExchange(this.exchange);
  }

  runOnly() {
    testExchange(this.exchange, true);
  }
}

function testExchange(exchange: ExchangeApi, only = false): void {
  const describeFunc = only ? describe.only : describe;
  const markets = exchange.testMarkets;

  describeFunc(`Test ${exchange.exchangeInfo.name} functions`, function () {
    // remove limited timeout
    this.timeout(0);

    // it test for ticker
    markets.forEach(market => {
      it(`should get ticker ${market}`, (done) => {
        exchange.ticker$(market).pipe(take(2)).subscribe(
          ticker => checkTicker(ticker),
          (e) => console.log('Error', e),
          () => done()
        );
      })
    });

    // it test for depth
    it('should get depths realtime for all pairs');
  });
}
