import 'mocha';
import { assert } from 'chai';

import { nextDateString } from './functions';

const dateStringArray = [
  '20180620',
  '20180621',
  '20180622',
  '20180623',
  '20180624',
  '20180625',
  '20180626',
  '20180627',
  '20180628',
  '20180629',
  '20180630',
  '20180701',
  '20180702',
  '20180703',
  '20180704',
  '20180705',
  '20180706',
  '20180707',
  '20180708',
  '20180709',
  '20180710',
  '20180711',
  '20180712',
  '20180713',
  '20180714',
  '20180715',
  '20180716',
  '20180717',
  '20180718',
  '20180719',
  '20180720',
  '20180721',
  '20180722',
];

describe('Bitbank candlestick internal functions', () => {
  it('test nextDateString', () => {
    for (let i = 0; i < dateStringArray.length - 1; i++) {
      assert(nextDateString(dateStringArray[i]), dateStringArray[i + 1]);
    }
  });
});
