# -----This is currently under development-----
# ccex-api
cryptocurrency exchange realtime api wrapper

# Usage
This library is designed to be usable in both nodejs and browser (with frontend framework) environment
## install
```
npm i --save ccex-api
```

## code
```
import { BitbankApi } from 'ccex-api/exchanges/bitbank;

const bitbankApi = new BitbankApi();
bitbankApi.fetchTicker$('btc_jpy').subscribe(ticker => console.log(ticker));
```

Or you can include only the part that you need
```
import { BitbankCandlestick } from 'ccex-api/exchanges/bitbank/bitbank-candlestick;

const bitbankCandlestick = new BitbankCandlestick();
bitbankCandlestick.getApproximateHistoryPrice('btc_jpy', 1526917534904, 1).subscribe(price => console.log(price));
```

# Supported Exchanges

Bitbank, Binance, Bitfinex

# Api
Basically all exchanges have these following api implemented.
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

Besides, an exchange may have more specific functions. It depends on exchange features and implementation.
In that case, it is good to have specific guide for that exchange located at `exchanges/{exchange}/README.md`

# Contributor guide
clone folder `src/exchanges/sample`

# Test

## Test all exchange
```
npm run test
```

## Test specific exchanges
```
npm run test bitbank binance
```