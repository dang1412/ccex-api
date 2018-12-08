import { take } from 'rxjs/operators';

import { ExchangeApi } from './exchange-api.abstract';
import { checkTicker } from './exchange-test.functions';

export class ExchangeApiTest {
  private readonly exchange: ExchangeApi;

  constructor(exchange: ExchangeApi) {
    this.exchange = exchange;
  }

  run(): void {
    testExchange(this.exchange);
  }
}

function testExchange(exchange: ExchangeApi): void {
  const markets = exchange.representativeMarkets;
  const supportFeatures = exchange.supportFeatures;

  describe(`${exchange.exchangeInfo.name} exchange`, () => {
    // it test for ticker
    if (supportFeatures.ticker) {
      markets.forEach((market) => {
        it(`should get ticker ${market} realtime`, (done) => {
          exchange
            .ticker$(market)
            .pipe(take(1))
            .subscribe(checkTicker, (e) => console.log('Error', e), done);
        });
      });
    }

    // it test for orderbook
    if (supportFeatures.orderbook) {
      it('should get orderbook realtime for all pairs', () => {/* test orderbook */});
    }
  });
}
