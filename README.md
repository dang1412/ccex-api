# ccex-realtime-api
cryptocurrency exchange realtime api wrapper

# Usage
## install
```
npm i --save ccex-realtime-api
```

## code
```
import { BitbankApi } from 'ccex-realtime-api/exchanges/bitbank;

const bitbankApi = new BitbankApi();
bitbankApi.fetchTicker$('btc_jpy').subscribe(ticker => console.log(ticker));
```

Or you can include only the part that you need
```
import { BitbankCandlestick } from 'ccex-realtime-api/exchanges/bitbank/bitbank-candlestick;

const bitbankCandlestick = new BitbankCandlestick(bitbankApi);
bitbankCandlestick.getApproximateHistoryPrice('btc_jpy', 1526917534904, 1).subscribe(price => console.log(price));
```

# Api
```
export abstract class ExchangeApi {
  abstract get exchangeInfo(): ExchangeInfo;
  abstract get marketNames(): Observable<string[]>;
  abstract get supportFeatures(): SupportFeatures;
  // request ticker
  abstract fetchTicker$(pair: string): Observable<Ticker>;
  // realtime ticker
  abstract ticker$(pair: string): Observable<Ticker>;
  // stop realtime ticker
  abstract stopTicker(pair: string): void;
  // request depth
  abstract fetchDepth$(pair: string): Observable<Depth>;
  // realtime depth
  abstract depth$(pair: string): Observable<Depth>;
  // stop realtime depth
  abstract stopDepth(pair: string): void;
  // request candlestick
  abstract fetchCandleStickRange$(pair: string, minutesFoot: number, start: number, end: number): Observable<CandleStick[]>;
  // realtime last candlestick
  abstract lastCandle$(pair: string, minutesFoot: number): Observable<CandleStick>;
}
```
# Test

## Test all exchange
```
npm run test
```

## Test specific exchanges
```
npm run test bitbank binance
```