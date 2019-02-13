import { WebsocketRxJsMock } from '../../../../common';

const MOCK_TICKER_DATA = [
  {
    a: '100',
    b: '99',
    l: '98',
    h: '101',
    c: '100',
    v: '25.5',
    p: '10',
    P: '5.5',
    E: '2019-01-01',
    o: '98.5',
    x: '90',
  },
  {
    a: '101',
    b: '99',
    l: '98',
    h: '101',
    c: '100',
    v: '25.5',
    p: '10',
    P: '5.5',
    E: '2019-01-02',
    o: '98.5',
    x: '90',
  },
  'stop',
];

export const MOCK_SOCKET = new WebsocketRxJsMock({
  default: MOCK_TICKER_DATA.map((data, i) => ({ time: i + 1, payload: data })),
});
