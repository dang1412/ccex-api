import { mergeBids, mergeAsks } from './update-orderbook';

interface BidTestCase {
  bids: [string, string][];
  updateBids: [string, string][];
  result: [string, string][];
}

interface AskTestCase {
  asks: [string, string][];
  updateAsks: [string, string][];
  result: [string, string][];
}

// bids test cases
const bidTestCases: BidTestCase[] = [
  {
    bids: [['1000', '1'], ['990', '1'], ['980', '1'], ['970', '1'], ['960', '1'], ['950', '1']],
    updateBids: [['995', '1'], ['990', '0']],
    result: [['1000', '1'], ['995', '1'], ['980', '1'], ['970', '1'], ['960', '1'], ['950', '1']],
  },
  {
    bids: [['1000', '1'], ['990', '1'], ['980', '1'], ['970', '1'], ['960', '1'], ['950', '1']],
    updateBids: [['1100', '10'], ['990', '0'], ['960', '0.111'], ['950', '0'], ['940', '12']],
    result: [['1100', '10'], ['1000', '1'], ['980', '1'], ['970', '1'], ['960', '0.111'], ['940', '12']],
  },
  {
    bids: [['1000', '1'], ['990', '1'], ['980', '1'], ['970', '1'], ['960', '1'], ['950', '1']],
    updateBids: [],
    result: [['1000', '1'], ['990', '1'], ['980', '1'], ['970', '1'], ['960', '1'], ['950', '1']],
  },
  {
    bids: [['99999', '0'], ['99998', '1.11']],
    updateBids: [['1100', '10'], ['990', '0'], ['960', '0.111'], ['950', '0'], ['940', '12']],
    result: [['99998', '1.11'], ['1100', '10'], ['960', '0.111'], ['940', '12']],
  },
];

// ask test cases
const askTestCases: AskTestCase[] = [
  {
    asks: [['1000', '1'], ['1100', '1'], ['1200', '1'], ['1300', '0']],
    updateAsks: [['900', '1'], ['1100', '0']],
    result: [['900', '1'], ['1000', '1'], ['1200', '1']],
  },
];

describe('Test update-orderbook.ts helper functions', () => {
  bidTestCases.forEach((test, index) => {
    it('Test mergeBids case # ' + index, () => {
      const actualResult = mergeBids(test.bids, test.updateBids);
      console.log('bids actualResult', actualResult);
      expect(actualResult).toStrictEqual(test.result); // , '#' + index + ': actual result is different from expect result');
    });
  });

  askTestCases.forEach((test, index) => {
    it('Test mergeAsks case # ' + index, () => {
      const actualResult = mergeAsks(test.asks, test.updateAsks);
      console.log('asks actualResult', actualResult);
      expect(actualResult).toStrictEqual(test.result); // , '#' + index + ': actual result is different from expect result');
    });
  });
});
