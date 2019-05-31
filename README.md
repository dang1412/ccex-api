[![CircleCI](https://circleci.com/gh/dang1412/ccex-api/tree/master.svg?style=svg)](https://circleci.com/gh/dang1412/ccex-api/tree/master)
[![Build Status](https://travis-ci.com/dang1412/ccex-api.svg?branch=master)](https://travis-ci.com/dang1412/ccex-api)

# ccex-api
Cryptocurrency exchanges client api wrapper.

# Features
These features are supported with all major exchanges
- Public realtime api.
- Public rest api.
- Support for both Nodejs and Browser (Webpack, React, Angular...see samples below) environments.
- Modular structure make sure you include minimum code as you need (especially for client side application).
- Option to bypass cors request problem in browser with [proxy](https://github.com/Rob--W/cors-anywhere).
- More to come: Tradingview realtime datafeed, private rest api with api/secret key...

# Prequisite
 - Using crypto to sign private request requrie node 10.
 - This library is built on top of [Typescript](https://www.typescriptlang.org/) and [Rxjs](https://github.com/ReactiveX/rxjs) (v6). All async functions will return an `observable` stream so familiar with [Rxjs](https://github.com/ReactiveX/rxjs) would be an advantage but basically using stream `.subscribe((data) => {/**/})` method should be sufficient. You can also easily turn an `one-time-complete` observable (rest API request) into promise using `.toPromise()` to be used with async await.

# Sample
 - [Demo](https://angular-practice-starter.firebaseapp.com/ccex-api)
 - [Angular sample](https://github.com/dang1412/angular-practice-starter/tree/feature/ccex-api)
 - [Production](https://www.exchangecompare.com/)
 - [React](samples/react-ccex-api)
 - [Webpack typescript](samples/webpack-chart)
 - Vue (TODO)

# Supported Exchanges
Binance, Bitbank, Bitfinex, Coinbase

|   | id/docs  | homepage | version | origin | country                |
|---|----------|----------|---------|--------|------------------------|
|![Binance](https://user-images.githubusercontent.com/1294454/29604020-d5483cdc-87ee-11e7-94c7-d1a8d9169293.jpg)  | [binance](src/exchanges/binance) | Binance  | *       | [API](https://github.com/binance-exchange/binance-official-api-docs/blob/master)    | China                  |
|![Bitbank](https://user-images.githubusercontent.com/1294454/37808081-b87f2d9c-2e59-11e8-894d-c1900b7584fe.jpg)  | [bitbank](src/exchanges/bitbank)  | Bitbank  | *       | [API](https://docs.bitbank.cc/)    | Japan                  |
|![Bitfinex](https://user-images.githubusercontent.com/1294454/27766244-e328a50c-5ed2-11e7-947b-041416579bb3.jpg)  | [bitfinex](src/exchanges/bitfinex) | Bitfinex | 2       | [API](https://bitfinex.readme.io/v2/docs)    | British Virgin Islands |
|![Coinbase](https://user-images.githubusercontent.com/1294454/40811661-b6eceae2-653a-11e8-829e-10bfadb078cf.jpg)  | [coinbase](src/exchanges/coinbase) | Coinbase | *       | [API](https://docs.pro.coinbase.com/)    | US                     |

# Roadmap (TODO)
| Task | Date | Status |
|---|---|---|
| Binance Private User Data Stream | 2018/09 | :white_check_mark: |
| Binance Private Api | 2018/12 | |
| Bitbank, Bitifnex, Coinbase private stream | 2019/Q1 | |
| Huobi, Okex | 2019/Q1 | |
| More exchanges | 2019/Q2 | |
| Python and Go version | 2019/Q3, Q4 | |

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
stopTicker| pair: `string` | | stop realtime ticker stream |
fetchTrades$| pair: `string` | Observable\<Trade> | api request for trade |
trade$| pair: `string` | Observable\<Trade> | realtime trade stream |
stopTrade| pair: `string` | | stop realtime trade stream |
fetchOrderbook$| pair: `string` | Observable\<Orderbook> | api request for orderbook |
orderbook$| pair: `string` | Observable\<Orderbook> | realtime orderbook stream |
stopOrderbook| pair: `string` | | stop realtime orderbook stream |
fetchCandleStickRange$| pair: `string` <br> minutesFoot: `number` <br> start: `number` <br> end: `number`| Observable<CandleStick[]> | api request for candlestick |
lastCandle$| pair: `string` <br> minutesFoot: `number` <br> lastCandle: `CandleStick` | Observable\<CandleStick> | Realtime candlestick stream, calculated from an initial lastCandle and realtime trade stream. <br> This function is useful in implementing Tradingview datafeed |

Besides, an exchange may have more specific functions, it depends on exchange provided features and implementation.
In that case, specific guide for that exchange will be located at `exchanges/{exchange}/README.md` (TODO)

# Contribution guide
In order to add a new exchange, simply clone folder `src/exchanges/sample`, rename, implement functions and include appropiate tests for sub-modules (ticker, orderbook...) and some internal functions.

Finally make sure the exchange `sample` pass predefined test by running

```
npm run test sample
```

If you find a bug or anything should be added to fit your need, please create issue. This is still in very early stage so any feedback would be much appreciated.

# Test
We can test all or 1 specific exchange. Note that a realtime test can fail by timeout according to server data stream coming late.
## Test all
```
npm run test
```

## Test specific exchanage
```
npm run test binance
npm run test bitbank
```

# Dependencies
- [Rxjs](https://github.com/ReactiveX/rxjs) (v6 or above)
- Optional
  - [pubnub](https://www.pubnub.com/) (bitbank api)
  - [node-fetch](https://github.com/bitinn/node-fetch) (nodejs environment)
  - [ws](https://github.com/websockets/ws) (nodejs environment)
