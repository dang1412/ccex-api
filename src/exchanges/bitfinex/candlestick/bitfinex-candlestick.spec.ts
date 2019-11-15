import { take } from 'rxjs/operators';

import { checkCandleStick } from '../../exchange-test.functions';
import { BitfinexCandleStick } from './bitfinex-candlestick';
import { BitfinexWebsocket } from '../websocket';

const bitfinexWebsocket = new BitfinexWebsocket();
const bitfinexCandlestick = new BitfinexCandleStick('', bitfinexWebsocket);

describe('Test bitfinex candlestick functions', () => {
  jest.setTimeout(30000);

  it('should fetch btc_usd 5min candles in time range', async () => {
    const candles = await bitfinexCandlestick.fetchCandleStickRange('btc_usd', 5, 1529509826239 - 60000 * 60 * 24, 1529509826239);
    checkCandleStick(candles[0]);
  });

  it('should get btc_usd 5min last candle realtime', (done) => {
    bitfinexCandlestick
      .candlestick$('btc_usd', 5)
      .pipe(take(2))
      .subscribe(
        (candle) => {
          checkCandleStick(candle);
        },
        () => console.log('error'),
        () => {
          bitfinexCandlestick.stopCandleStick('btc_usd', 5);
          bitfinexWebsocket.destroy();
          done();
        },
      );
  });
});
