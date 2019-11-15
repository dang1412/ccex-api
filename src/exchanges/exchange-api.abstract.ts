import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

import { ExchangeInfo, SupportFeatures, Ticker, Orderbook, Trade, CandleStick, ExchangeOptions } from './exchange-types';
import { updateLastCandleWithNewTrade } from './helper.functions';
import { defaultOptions } from './exchange-default.options';

export abstract class ExchangeApi {
  protected options: ExchangeOptions;
  abstract get exchangeInfo(): ExchangeInfo;
  abstract get markets(): string[];
  abstract get representativeMarkets(): string[];
  abstract get supportFeatures(): SupportFeatures;

  constructor(options?: ExchangeOptions) {
    this.options = { ...defaultOptions, ...options };
  }

  // request ticker
  abstract fetchTicker(pair: string): Promise<Ticker>;
  // realtime ticker
  abstract ticker$(pair: string): Observable<Ticker>;
  // stop realtime ticker
  abstract stopTicker(pair: string): void;

  // request orderbook
  abstract fetchOrderbook(pair: string): Promise<Orderbook>;
  // realtime orderbook
  abstract orderbook$(pair: string): Observable<Orderbook>;
  // stop realtime orderbook
  abstract stopOrderbook(pair: string): void;

  // request trades
  abstract fetchTrades(pair: string): Promise<Trade[]>;
  // realtime trades
  abstract trade$(pair: string): Observable<Trade>;
  // stop realtime trades
  abstract stopTrade(pair: string): void;

  // request candlestick (used in tradingview or other chart)
  abstract fetchCandleStickRange(pair: string, minutesFoot: number, start: number, end: number): Promise<CandleStick[]>;

  // realtime last candlestick using initial last candle and realtime trade (used for tradingview datafeed)
  lastCandle$(pair: string, initialLastCandle: CandleStick, minutesFoot: number): Observable<CandleStick> {
    return this.trade$(pair).pipe(
      scan((candle: CandleStick, trade: Trade) => updateLastCandleWithNewTrade(candle, trade, minutesFoot), initialLastCandle),
    );
  }

  stopLastCandle(pair: string): void {
    // stop listening to realtime trades
    this.stopTrade(pair);
  }

  /**
   * Private api
   */

  // abstract spotOrder(pair: string, side: 'buy' | 'sell', price: string, amount: string): Observable<SpotOrderResponse>;
  // abstract cancelOrder(orderId: string): Observable<CancelOrderResponse>;
  // abstract activeOrder(pair?: string): Observable<ActiveOrderResponse>;
  // abstract orderHistory(pair?: string): Observable<OrderHistoryResponse>;
  // abstract tradeHistory(pair?: string): Observable<TradeHistoryResponse>;
}
