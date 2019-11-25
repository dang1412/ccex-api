import { timer } from 'rxjs';
import { take, skipUntil } from 'rxjs/operators';

import { checkCandleStick } from '../../exchange-test.functions';
import { BinanceWebsocket } from '../websocket';
import { BinanceCandleStick } from './binance-candlestick';

const binanceWebsocket = new BinanceWebsocket();
const binanceCandlestick = new BinanceCandleStick(binanceWebsocket);
const minutesFoot = 5;
const pair = 'btc_usdt';

const otherMinutesFoot = 1;
const timeToStop = 1000;

beforeEach(() => {
  binanceCandlestick.stop(pair, minutesFoot);
});

describe('Test binance candlestick functions', () => {
  jest.setTimeout(10000);

  it(`should fetch ${pair} ${minutesFoot}min candles in provided time range`, async () => {
    const candles = await binanceCandlestick.fetchRange(pair, minutesFoot, 1529509826239 - 60000 * 60 * 24, 1529509826239);
    candles.forEach(checkCandleStick);
  });

  it(`should get ${pair} ${minutesFoot}min last candle realtime`, (done) => {
    binanceCandlestick
      .stream$(pair, minutesFoot)
      .pipe(take(2))
      .subscribe(
        (candle) => {
          checkCandleStick(candle);
        },
        () => console.log('error'),
        () => {
          done();
        },
      );
  });

  // it(`should complete stream when stop candle socket`, (done) => {
  //   binanceCandlestick.stream$(pair, minutesFoot).subscribe(
  //     () => {
  //       /**/
  //     },
  //     () => console.log('error'),
  //     () => {
  //       done();
  //     },
  //   );

  //   setTimeout(() => binanceCandlestick.stop(pair, minutesFoot), 1000);
  // });

  it(`should not complete stream when stop same pair but different minutesFoot candle socket`, (done) => {
    let completeOtherCandleStream = false;

    binanceCandlestick.stream$(pair, otherMinutesFoot).subscribe(
      (candle) => {
        checkCandleStick(candle);
      },
      () => console.log('error'),
      () => {
        completeOtherCandleStream = true;
      },
    );

    binanceCandlestick
      .stream$(pair, minutesFoot)
      .pipe(skipUntil(timer(timeToStop + 200)))
      .subscribe((candle) => {
        checkCandleStick(candle);
        expect(completeOtherCandleStream);
        binanceCandlestick.stop(pair, minutesFoot);
        done();
      });

    setTimeout(() => binanceCandlestick.stop(pair, otherMinutesFoot), timeToStop);
  });
});
