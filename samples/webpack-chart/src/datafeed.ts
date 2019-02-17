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
} from '../lib/charting_library/charting_library.min';

const resolutionToDataName: { [key: string]: string } = {
  1: 'min1',
  5: 'min5',
  10: 'min10',
  15: 'min15',
  30: 'min30',
  60: 'min60',
  120: 'min120',
  D: 'day',
};

export class Datafeed implements IBasicDataFeed {
  searchSymbols(userInput: string, exchange: string, symbolType: string, onResult: SearchSymbolsCallback): void {
    throw new Error('Method not implemented.');
  }

  resolveSymbol(symbolName: string, onResolve: ResolveCallback, onError: ErrorCallback): void {
    const symbol = 'btc_usd';

    const symbolData = {
      name: symbol,
      full_name: symbol,
      exchange: 'bitfinex',
      listed_exchange: symbol,
      timezone: <TradingView.Timezone>'Asia/Tokyo',
      minmov: 1,
      pricescale: 100,
      session: '24x7',
      has_intraday: true,
      has_no_volume: false,
      ticker: symbol,
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
    resolution: string,
    rangeStartDate: number,
    rangeEndDate: number,
    onResult: HistoryCallback,
    onError: ErrorCallback,
    isFirstCall: boolean,
  ): void {
    // use only resolution to get stored data
    const fileName = resolutionToDataName[resolution] || 'day';
    const url = `${fileName}.json`;

    // return data only for first time
    if (isFirstCall) {
      /* tslint:disable:no-floating-promises promise-function-async */
      fetch(url)
        .then((data) => data.json())
        .then((data: Bar[]) => {
          onResult(data, { noData: false });
        });
    } else {
      onResult([], { noData: true });
    }
  }

  subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: string,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    onResetCacheNeededCallback: () => void,
  ): void {
    console.log('subscribeBars');
    // throw new Error('Method not implemented.');
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
