# ccex-api
cryptocurrency exchanges client api wrapper.

# Features
These features are supported with all major exchanges
- Public realtime api.
- Public rest api.
- Support for both Nodejs and Browser environments.
- Modular structure make sure you include minimum code as you need (especially for client side application).
- Option to bypass cors request problem in browser with [proxy](https://github.com/Rob--W/cors-anywhere).
- More to come: Tradingview datafeed, private rest api with api/secret key...

# Sample
 - [Angular sample](https://github.com/dang1412/angular-practice-starter/tree/feature/ccex-api)
 - Webpack typescript (future)
 - Rollup typescript (future)

# Supported Exchanges
Binance, Bitbank, Bitfinex, Coinbase (Gdax)

|                                                                                                                           | id                 | name                                                                         | ver | doc                                                                                          | countries                               |
|---------------------------------------------------------------------------------------------------------------------------|--------------------|------------------------------------------------------------------------------|:---:|:--------------------------------------------------------------------------------------------:|-----------------------------------------|
|![Binance](https://user-images.githubusercontent.com/1294454/29604020-d5483cdc-87ee-11e7-94c7-d1a8d9169293.jpg)            | binance            | [Binance](https://www.binance.com)                                           | *   | [API](https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md) | Japan                                   |
|![Bitbank](https://user-images.githubusercontent.com/1294454/37808081-b87f2d9c-2e59-11e8-894d-c1900b7584fe.jpg)            | bitbank            | [Bitbank](https://bitbank.cc/)                                               | 1   | [API](https://docs.bitbank.cc/)                                                              | Japan                                   |
|![Bitfinex](https://user-images.githubusercontent.com/1294454/27766244-e328a50c-5ed2-11e7-947b-041416579bb3.jpg)           | bitfinex           | [Bitfinex v2](https://www.bitfinex.com)                                      | 2   | [API](https://bitfinex.readme.io/v2/docs)                                                    | British Virgin Islands                  |
|![Coinbase](https://user-images.githubusercontent.com/1294454/27766527-b1be41c6-5edb-11e7-95f6-5b496c469e2c.jpg)           | coinbase           | [Coinbase](https://pro.coinbase.com/)                                        | *   | [API](https://docs.pro.coinbase.com/)                                                        | US                                      |

# Modular structure
When you include a module you also include all of its dependencies

# Usage
This library is designed to be usable in both nodejs and browser (with frontend framework like Angular, React, Vue..., with bundle tools like Webpack or Rollup having typescript configured, the umd javascript file coming later) environments.

When used in browser environment, the browser must support for native
 - [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
 - [websocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## Installation
```
npm i --save ccex-api
```

## Simple use
```
import { BinanceApi } from 'ccex-api/exchanges/binance;

const binanceApi = new BinanceApi();

binanceApi.fetchTicker$('btc_usdt').subscribe(ticker => console.log(ticker));
binanceApi.ticker$('btc_usdt').subscribe(ticker => console.log(ticker));
setTimeout(() => { binanceApi.stopTicker('btc_usdt') }, 5000);
```

Or you can include only the part that you need
```
import { BitbankCandlestick } from 'ccex-api/exchanges/bitbank/candlestick;

const bitbankCandlestick = new BitbankCandlestick();
bitbankCandlestick.getApproximateHistoryPrice('btc_jpy', 1526917534904, 1).subscribe(price => console.log(price));
```

# Terminology
 - Pair (market/symbol): must have the following format `btc_usd` (lowercase with underscore between 2 asset)

# Api
Basically all exchanges have these following unified, generalized api implemented.

|api|params|return value | desctiption |
---|---|---|---
exchangeInfo| | ExchangeInfo | |
markets| | string[] | All supported markets (pair) |
representativeMarkets| | string[] | Major supported markets (used for test purpose) |
supportFeatures| | SupportFeatures | |
fetchTicker$| pair: `string` | Observable\<Ticker> | api request for ticker |
ticker$| pair: `string` | Observable\<Ticker> | realtime ticker stream |
stopTicker| | | stop realtime ticker stream |
fetchTrades$| pair: `string` | Observable\<Trade> | api request for trade |
trade$| pair: `string` | Observable\<Trade> | realtime trade stream |
stopTrade| | | stop realtime trade stream |
fetchOrderbook$| pair: `string` | Observable\<Orderbook> | api request for orderbook |
orderbook$| pair: `string` | Observable\<Orderbook> | realtime orderbook stream |
stopOrderbook| | | stop realtime orderbook stream |
fetchCandleStickRange$| pair: `string` <br> minutesFoot: `number` <br> start: `number` <br> end: `number`| Observable<CandleStick[]> | api request for candlestick |
lastCandle$| pair: `string` <br> minutesFoot: `number` <br> lastCandle: `CandleStick` | Observable\<CandleStick> | Realtime candlestick stream, calculated from an initial lastCandle and realtime trade stream. <br> This function is useful in implementing Tradingview datafeed |

Besides, an exchange may have more specific functions, it depends on exchange provided features and implementation.
In that case, specific guide for that exchange will be located at `exchanges/{exchange}/README.md` (`future`)

# Contributor guide
In order to add a new exchange, simply clone folder `src/exchanges/sample`, rename, implement functions and include appropiate tests for sub-modules (ticker, orderbook...) and some internal functions (`future`)

Finally make sure the exchange `sample` pass predefined test by running (`future`)

```
npm run main-test --exchange sample
```

If you find a bug or anything should be added to fit your need, please create issue. This is still in very early stage so any feedback would be much appreciated.

# Test (`future`)
main test: test for main module which implement the above interface directly
```
npm run main-test
```

sub test: test for sub-modules used inside main module and its internal functions
```
npm run sub-test
```

# Dependencies
This library is built strongly on top of Rxjs (v6 or above)
- [Rxjs](https://github.com/ReactiveX/rxjs)
- [pubnub](https://www.pubnub.com/)
- [node-fetch](https://github.com/bitinn/node-fetch) (nodejs only)
- [ws](https://github.com/websockets/ws) (nodejs only)
