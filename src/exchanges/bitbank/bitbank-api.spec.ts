import { ExchangeApiTest } from '../exchange-api.test';
import { BitbankApi } from './bitbank-api';

const bitbankApi = new BitbankApi();
new ExchangeApiTest(bitbankApi).run();
