import 'mocha';
import { assert } from 'chai';
import { timer } from 'rxjs';
import { take, skipUntil } from 'rxjs/operators';

import { checkCandleStick } from '../../exchange-test.functions';
import { BinanceCandleStick } from './binance-candlestick';

const binanceCandlestick = new BinanceCandleStick();
const minutesFoot = 5;
const pair = 'btc_usdt';

beforeEach(() => {
  console.log('----- stopCandleStick -----');
  binanceCandlestick.stopCandleStick(pair, minutesFoot);
});

describe.only('Test binance candlestick functions', function() {
  this.timeout(0);

  it(`should fetch ${pair} ${minutesFoot}min candles in provided time range`, (done) => {
    binanceCandlestick.fetchCandleStickRange$(pair, minutesFoot, 1529509826239 - 60000 * 60 * 24, 1529509826239).toPromise().then((candles) => {
      console.log(candles.length, candles[0]);
      candles.forEach(checkCandleStick);
      done();
    });
  });

  it(`should get ${pair} ${minutesFoot}min last candle realtime`, (done) => {
    binanceCandlestick
      .candlestick$(pair, minutesFoot)
      .pipe(take(3))
      .subscribe(
        (candle) => {
          console.log(candle);
          checkCandleStick(candle);
        },
        () => console.log('error'),
        () => {
          done();
        },
      );
  });

  it(`should complete stream when stop candle socket`, (done) => {
    binanceCandlestick
      .candlestick$(pair, minutesFoot).subscribe(candle => console.log('---> candle come'), () => console.log('error'), () => {
        console.log('===> candle stream complete');
        done();
      });

    setTimeout(() => binanceCandlestick.stopCandleStick(pair, minutesFoot), 5000);
  });

  it(`should not complete stream when stop same pair but different minutesFoot candle socket`, function (done) {
    const timeToStopDifferentSocket = 2000;
    const diffMinutesFoot = 1;
    let completeDiffCandleStream = false;

    binanceCandlestick
      .candlestick$(pair, diffMinutesFoot)
      .subscribe(candle => {
        console.log('---> candle', diffMinutesFoot);
        checkCandleStick(candle);
      }, () => console.log('error'), () => {
        console.log('===> complete candle', diffMinutesFoot);
        completeDiffCandleStream = true;
      });

    binanceCandlestick
      .candlestick$(pair, minutesFoot)
      .pipe(skipUntil(timer(timeToStopDifferentSocket * 2)), take(1))
      .subscribe(candle => {
        console.log('---> candle', minutesFoot);
        checkCandleStick(candle);
        assert(completeDiffCandleStream, 'first stream should completed before');
        done();
      });

    setTimeout(() => binanceCandlestick.stopCandleStick(pair, 1), timeToStopDifferentSocket);
  });
});
