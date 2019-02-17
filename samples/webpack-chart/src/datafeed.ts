import { BitfinexApi, CandleStick } from 'ccex-api';

import {
  Bar,
  ErrorCallback,
  HistoryCallback,
  IBasicDataFeed,
  LibrarySymbolInfo,
  OnReadyCallback,
  ResolveCallback,
  SearchSymbolsCallback,
  SubscribeBarsCallback,
  ResolutionString,
} from '../lib/charting_library/charting_library.min';

const corsProxy = 'https://api.exchangecompare.com/';
const pair = 'btc_usd';

export class Datafeed implements IBasicDataFeed {
  private exchangeApi: BitfinexApi;
  private initialLastCandle: CandleStick | null = null;

  constructor() {
    this.exchangeApi = new BitfinexApi({ corsProxy });
  }

  searchSymbols(userInput: string, exchange: string, symbolType: string, onResult: SearchSymbolsCallback): void {
    throw new Error('Method not implemented.');
  }

  resolveSymbol(symbolName: string, onResolve: ResolveCallback, onError: ErrorCallback): void {
    const symbolData = {
      name: pair,
      full_name: pair,
      exchange: 'bitfinex',
      listed_exchange: pair,
      timezone: <TradingView.Timezone>'Asia/Tokyo',
      minmov: 1,
      pricescale: 100,
      session: '24x7',
      has_intraday: true,
      has_no_volume: false,
      ticker: pair,
      description: 'bitfinex',
      type: 'bitcoin',
      supported_resolutions: ['1', '5', '15', '30', '60', '120', 'D'],
    };
    // onResolve invoked async
    setTimeout(() => {
      onResolve(symbolData);
    });
  }

  getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    rangeStartDate: number,
    rangeEndDate: number,
    onResult: HistoryCallback,
    onError: ErrorCallback,
    isFirstCall: boolean,
  ): void {
    const minutesFoot = resolutionToMinutes(resolution);

    this.exchangeApi
      .fetchCandleStickRange$(pair, minutesFoot, rangeStartDate * 1000, rangeEndDate * 1000)
      .subscribe((candlesticks) => {
        if (isFirstCall && candlesticks && candlesticks.length) {
          this.initialLastCandle = candlesticks[candlesticks.length - 1];
        }
        const bars = candlesticks.map(adaptCandlestickToBar);
        const noData = isFirstCall || (bars && bars.length > 0) ? false : true;
        onResult(bars, { noData });
      });
  }

  subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: string,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    onResetCacheNeededCallback: () => void,
  ): void {
    console.log('subscribeBars');
    const minutesFoot = resolutionToMinutes(resolution);
    if (this.initialLastCandle) {
      this.exchangeApi.lastCandle$(pair, this.initialLastCandle, minutesFoot)
        .subscribe((lastCandle) => {
          const updatedLastBar = adaptCandlestickToBar(lastCandle);
          onTick(updatedLastBar);
        });
    }
  }

  unsubscribeBars(listenerGuid: string): void {
    console.log('unsubscribeBars');
    // throw new Error('Method not implemented.');
  }

  onReady(callback: OnReadyCallback): void {
    // throw new Error('Method not implemented.');
    // callback invoked async
    // default configuration
    setTimeout(callback);
  }
}

// get minutesFoot from Tradingview resolution
function resolutionToMinutes(res: ResolutionString): number {
  const resStringMinuteMap: {[key: string]: number} = {
    'D': 1440,
    '1D': 1440,
  };

  const minutes = resStringMinuteMap[res] || Number(res);
  if (!minutes) {
    throw new Error(`Resolution is not recognized ${res}`);
  }

  return minutes;
}

// adapt ccex-api CandleStick type to tradingview Bar type
function adaptCandlestickToBar(candlestick: CandleStick): Bar {
  return { ...candlestick, time: candlestick.timestamp };
}
