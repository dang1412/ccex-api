import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

import { ExchangeInfo, SupportFeatures, Ticker, Orderbook, Trade, CandleStick } from './exchange-types';
import { updateLastCandleWithNewTrade } from './helper.functions';

export abstract class ExchangeApi {
  abstract get exchangeInfo(): ExchangeInfo;
  abstract get markets(): string[];
  abstract get representativeMarkets(): string[];
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

  //request trades
  abstract fetchTrades$(pair: string): Observable<Trade[]>;
  // realtime trades
  abstract trade$(pair: string): Observable<Trade>;
  // stop realtime trades
  abstract stopTrade(pair: string): void;

  // request candlestick (used in tradingview or other chart)
  abstract fetchCandleStickRange$(pair: string, minutesFoot: number, start: number, end: number): Observable<CandleStick[]>;

  // realtime last candlestick using initial last candle and realtime trade (used for tradingview datafeed)
  lastCandle$(pair: string, lastCandle: CandleStick, minutesFoot: number): Observable<CandleStick> {
    return this.trade$(pair).pipe(
      scan((candle: CandleStick, trade: Trade) => updateLastCandleWithNewTrade(candle, trade, minutesFoot), lastCandle),
    );
  }

  stopLastCandle(pair: string): void {
    // stop listening to realtime trades
    this.stopTrade(pair);
  }
}
