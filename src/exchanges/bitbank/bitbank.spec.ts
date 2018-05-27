import { ExchangeApiTest } from '../exchange-api.test';
import { Bitbank } from './bitbank';

const bitbank = new Bitbank();
new ExchangeApiTest(bitbank).run();
