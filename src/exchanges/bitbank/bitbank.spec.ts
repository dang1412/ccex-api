// import 'mocha';
// import { expect } from 'chai';

// import { Ticker } from '../exchange.type';
// import { Bitbank } from './bitbank';

// const bitbank = new Bitbank();

// describe('Test bitbank functions', () => {
//   it('should get xrp_jpy ticker realtime properly', (done) => {
//     const pair = 'xrp_jpy';
//     let count = 0;
//     const sub = bitbank.ticker$(pair).subscribe(ticker => {
//       console.log('Got btc_jpy ticker =>', ticker);
//       count ++;
//       expect(checkTicker(ticker)).to.true;

//       if (count === 2) {
//         bitbank.stopTicker(pair);
//         sub.unsubscribe();
//         done();
//       }
//     })
//   });
// });

// function checkTicker(ticker: Ticker): boolean {
//   return ticker
//     && typeof ticker.last === 'number'
//     && typeof ticker.low === 'number'
//     && typeof ticker.high === 'number';
// }
import { ExchangeApiTest } from '../exchange-api.test';
import { Bitbank } from './bitbank';

const bitbank = new Bitbank();

new ExchangeApiTest(bitbank).run();
