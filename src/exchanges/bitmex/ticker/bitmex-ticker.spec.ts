import { checkTicker } from '../../exchange-test.functions';
import { BitmexTicker } from './bitmex-ticker';

const bitmexTicker = new BitmexTicker();

describe('bitmexTicker', () => {
  const markets = ['xbt_usd'];
  markets.forEach((market) => {
    it(`should fetch ticker ${market}`, () => {});
  });
});
