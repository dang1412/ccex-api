import 'mocha';
import { take, finalize } from 'rxjs/operators';

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
  // get all markets before run it
  let markets = [];
  before((done) => {
    exchange.marketNames.subscribe((marketNames) => {
      markets = marketNames;
      done();
    });
  });

  const describeFunc = only ? describe.only : describe;

  describeFunc(`Test ${exchange.exchangeInfo.name} functions`, function () {
    // remove limited timeout
    this.timeout(0);

    // it test for ticker
    it(`should get tickers realtime for all pairs`, (done) => {
      let count = markets.length;
      markets.forEach(market => {
        exchange.ticker$(market).pipe(take(2), finalize(() => {
          count--;
          if (count === 0) {
            done();
          }
        })).subscribe(ticker => checkTicker(ticker));
      })
    });

    // it test for depth
    it('should get depths realtime for all pairs');
  });
}
