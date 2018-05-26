import 'mocha';
import { expect } from 'chai';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { Ticker } from './exchange.type';
import { ExchangeApi } from './exchange-api.abstract';

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
        testTickerStream(exchange.ticker$(market), () => {
          count --;
          if (count === 0) {
            done();
          }
        });
      })
    });

    // it test for depth
    it('should get depths realtime for all pairs');
  });
}

function testTickerStream(ticker$: Observable<Ticker>, cb: Function, checkNumber = 1): void {
  ticker$.pipe(take(checkNumber)).subscribe(
    (ticker) => {
      expect(checkTicker(ticker)).to.true;
    },
    (e) => {},
    () => {
      cb();
    }
  );
}

function checkTicker(ticker: Ticker): boolean {
  return ticker
    && typeof ticker.last === 'number'
    && typeof ticker.low === 'number'
    && typeof ticker.high === 'number';
}
