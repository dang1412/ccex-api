import { timer } from 'rxjs';
import { take, skipUntil } from 'rxjs/operators';

import { checkCandleStick } from '../../exchange-test.functions';
import { BinanceCandleStick } from './binance-candlestick';

const binanceCandlestick = new BinanceCandleStick();
const minutesFoot = 5;
const pair = 'btc_usdt';

const otherMinutesFoot = 1;
const timeToStop = 1000;

beforeEach(() => {
  binanceCandlestick.stopCandleStick(pair, minutesFoot);
});

describe('Test binance candlestick functions', function() {
  jest.setTimeout(10000);

  it(`should fetch ${pair} ${minutesFoot}min candles in provided time range`, (done) => {
    binanceCandlestick
      .fetchCandleStickRange$(pair, minutesFoot, 1529509826239 - 60000 * 60 * 24, 1529509826239)
      .toPromise()
      .then((candles) => {
        candles.forEach(checkCandleStick);
        done();
      });
  });

  it(`should get ${pair} ${minutesFoot}min last candle realtime`, (done) => {
    binanceCandlestick
      .candlestick$(pair, minutesFoot)
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

  it(`should complete stream when stop candle socket`, (done) => {
    binanceCandlestick.candlestick$(pair, minutesFoot).subscribe(
      () => { /**/ },
      () => console.log('error'),
      () => {
        done();
      },
    );

    setTimeout(() => binanceCandlestick.stopCandleStick(pair, minutesFoot), 1000);
  });

  it(`should not complete stream when stop same pair but different minutesFoot candle socket`, function(done) {
    let completeOtherCandleStream = false;

    binanceCandlestick.candlestick$(pair, otherMinutesFoot).subscribe(
      (candle) => {
        checkCandleStick(candle);
      },
      () => console.log('error'),
      () => {
        completeOtherCandleStream = true;
      },
    );

    binanceCandlestick
      .candlestick$(pair, minutesFoot)
      .pipe(
        skipUntil(timer(timeToStop + 200)),
      )
      .subscribe((candle) => {
        checkCandleStick(candle);
        expect(completeOtherCandleStream);
        binanceCandlestick.stopCandleStick(pair, minutesFoot);
        done();
      });

    setTimeout(() => binanceCandlestick.stopCandleStick(pair, otherMinutesFoot), timeToStop);
  });
});
