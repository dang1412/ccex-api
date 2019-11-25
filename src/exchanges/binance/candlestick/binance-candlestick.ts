import fetch from 'node-fetch';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CandleStick } from '../../exchange-types';
import { BinanceWebsocket } from '../websocket';
import { BinanceRestCandle, BinanceWsCandle } from './internal/types';
import { binanceCandleStickApiUrl, adaptBinanceRestCandle, adaptBinanceWsCandle, getCandleStickChannel } from './internal/functions';

export class BinanceCandleStick {
  constructor(private readonly binanceWebsocket: BinanceWebsocket, private readonly corsProxy: string = '') {}

  async fetchRange(pair: string, minutesFoot: number, start: number, end: number): Promise<CandleStick[]> {
    const originUrl = binanceCandleStickApiUrl(pair, minutesFoot, start, end);
    const url = this.corsProxy ? this.corsProxy + originUrl : originUrl;

    const raws: BinanceRestCandle[] = await fetch(url).then(res => res.json());

    return raws.map(adaptBinanceRestCandle);
  }

  stream$(pair: string, minutesFoot: number): Observable<CandleStick> {
    const channel = getCandleStickChannel(pair, minutesFoot);

    return this.binanceWebsocket.subscribeChannel<BinanceWsCandle>(channel).pipe(
      map(adaptBinanceWsCandle),
    );
  }

  stop(pair: string, minutesFoot: number): void {
    const channel = getCandleStickChannel(pair, minutesFoot);
    this.binanceWebsocket.unsubscribeChannel(channel);
  }
}
