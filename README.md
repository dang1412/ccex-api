# -----This is currently under development-----
# ccex-api
cryptocurrency exchanges client api wrapper

# Features
These features are supported with all major exchanges
- Public realtime api
- Public rest api
- Support for both Nodejs and Browser environments
- Modular structure make sure you include minimum code as you need (exspecially for client side application)
- Option to bypass cors request problem in browser with [proxy](https://github.com/Rob--W/cors-anywhere)
- More to come: Tradingview datafeed for each exchange, private rest api with api key...

# Modular structure
This sample of one way dependencies diagram demonstrates how modules are structured and combined. This may differentiated from one exchange to another.

<p align="center"><img src="assets/ccex-api-sample-structure.png"></p>

When you include a module you also include all of its dependencies

# Supported Exchanges
Bitbank, Binance, Bitfinex, Coinbase (Gdax), Coincheck...

# Usage
This library is designed to be usable in both nodejs and browser (with frontend framework like Angular, React, Vue,...) environments
## Installation
```
npm i --save ccex-api
```

## Simple use
```
import { BitbankApi } from 'ccex-api/exchanges/bitbank;

const bitbankApi = new BitbankApi();

bitbankApi.fetchTicker$('btc_jpy').subscribe(ticker => console.log(ticker));
bitbankApi.ticker$('btc_jpy').subscribe(ticker => console.log(ticker));
setTimeout(() => { bitbankApi.stopTicker('btc_jpy') }, 5000);
```

Or you can include only the part that you need
```
import { BitbankCandlestick } from 'ccex-api/exchanges/bitbank/candlestick;

const bitbankCandlestick = new BitbankCandlestick();
bitbankCandlestick.getApproximateHistoryPrice('btc_jpy', 1526917534904, 1).subscribe(price => console.log(price));
```

# Api
Basically all exchanges have these following api implemented.
```
export abstract class ExchangeApi {
  abstract get exchangeInfo(): ExchangeInfo;
  abstract get markets(): string[];
  abstract get testMarkets(): string[];
  abstract get supportFeatures(): SupportFeatures;
  // request ticker
  abstract fetchTicker$(pair: string): Observable<Ticker>;
  // realtime ticker
  abstract ticker$(pair: string): Observable<Ticker>;
  // stop realtime ticker
  abstract stopTicker(pair: string): void;
  // request orderbook
  abstract fetchOrderbook$(pair: string): Observable<Orderbook>;
  // realtime orderbook
  abstract orderbook$(pair: string): Observable<Orderbook>;
  // stop realtime orderbook
  abstract stopOrderbook(pair: string): void;
  // request candlestick
  abstract fetchCandleStickRange$(pair: string, minutesFoot: number, start: number, end: number): Observable<CandleStick[]>;
  // realtime last candlestick (used for tradingview datafeed)
  abstract lastCandle$(pair: string, minutesFoot: number): Observable<CandleStick>;
}
```

Besides, an exchange may have more specific functions. It depends on exchange provided features and implementation.
In that case, it is good to have specific guide for that exchange located at `exchanges/{exchange}/README.md`

# Contributor guide
In order to add a new exchange, simply clone folder `src/exchanges/sample`, rename and implement functions

# Test

```
npm test
```

# Dependencies
This library is built strongly upon Rxjs (v6.0.0 or above)
- [Rxjs](https://github.com/ReactiveX/rxjs)
- [node-fetch](https://github.com/bitinn/node-fetch) (nodejs)
- [ws](https://github.com/websockets/ws) (nodejs)
