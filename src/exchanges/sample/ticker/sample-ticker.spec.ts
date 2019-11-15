import { checkTicker } from '../../exchange-test.functions';
import { SampleTicker } from './sample-ticker';

const sampleTicker = new SampleTicker();

describe('sampleTicker', () => {
  const markets = ['btc_jpy'];
  markets.forEach((market) => {
    it(`should fetch ticker ${market}`, async () => {
      const ticker = await sampleTicker.fetchTicker(market);
      checkTicker(ticker);
    });
  });
});
