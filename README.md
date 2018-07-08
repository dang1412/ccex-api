# ccex-api
cryptocurrency exchanges client api wrapper

# Features
These features are supported with all major exchanges
- Public realtime api
- Public rest api
- Support for both Nodejs and Browser environments
- Modular structure make sure you include minimum code as you need (exspecially for client side application)
- Option to bypass cors request problem in browser with [proxy](https://github.com/Rob--W/cors-anywhere)
- More to come: Tradingview datafeed, private rest api with api key...

# Modular structure
This sample of one way dependencies diagram demonstrates how modules are structured and combined. This may different from one another.

<p align="center"><img src="assets/ccex-api-sample-structure.png"></p>

When you include a module you also include all of its dependencies

# Supported Exchanges
Binance, Bitbank, Bitfinex, Coinbase (Gdax)

|                                                                                                                           | id                 | name                                                                         | ver | doc                                                                                          | countries                               |
|---------------------------------------------------------------------------------------------------------------------------|--------------------|------------------------------------------------------------------------------|:---:|:--------------------------------------------------------------------------------------------:|-----------------------------------------|
|![Binance](https://user-images.githubusercontent.com/1294454/29604020-d5483cdc-87ee-11e7-94c7-d1a8d9169293.jpg)            | binance            | [Binance](https://www.binance.com)                                           | *   | [API](https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md) | Japan                                   |
|![Bitbank](https://user-images.githubusercontent.com/1294454/37808081-b87f2d9c-2e59-11e8-894d-c1900b7584fe.jpg)            | bitbank            | [Bitbank](https://bitbank.cc/)                                               | 1   | [API](https://docs.bitbank.cc/)                                                              | Japan                                   |
|![Bitfinex](https://user-images.githubusercontent.com/1294454/27766244-e328a50c-5ed2-11e7-947b-041416579bb3.jpg)           | bitfinex           | [Bitfinex v2](https://www.bitfinex.com)                                      | 2   | [API](https://bitfinex.readme.io/v2/docs)                                                    | British Virgin Islands                  |
|![Coinbase](https://user-images.githubusercontent.com/1294454/27766527-b1be41c6-5edb-11e7-95f6-5b496c469e2c.jpg)           | coinbase           | [Coinbase](https://pro.coinbase.com/)                                        | *   | [API](https://docs.pro.coinbase.com/)                                                        | US                                      |

# Usage
This library is designed to be usable in both nodejs and browser (with frontend framework like Angular, React, Vue,... The umd javascript file coming later) environments. When used in browser environment, the browser must support for native
 - [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
 - [websocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

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
Basically all exchanges have these following unified, generalized api implemented.

|api|params|return value | desctiption |
---|---|---|---
exchangeInfo| | ExchangeInfo | |
markets| | string[] | |
representativeMarkets| | string[] | |
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
In that case, it is good to have specific guide for that exchange located at `exchanges/{exchange}/README.md`

# Contributor guide
In order to add a new exchange, simply clone folder `src/exchanges/sample`, rename, implement functions and include appropiate tests for sub-modules (ticker, orderbook...) and some internal functions

Finally make sure the exchange `sample` pass our predefined test by running

```
npm run main-test --exchange sample
```

# Test
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
