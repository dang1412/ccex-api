import { WebsocketRxJsMock } from '../../../../common';
import { WebsocketResponseI, WebsocketDataI } from '../bitfinex-websocket.type';

export const MOCK_SOCKET = new WebsocketRxJsMock<WebsocketResponseI | WebsocketDataI>({
  '{"channel":"ticker","symbol":"tBTCUSD","event":"subscribe"}': [
    {
      time: 10,
      payload: {
        channel: 'ticker',
        event: 'subscribed',
        chanId: 1,
        pair: 'BTCUSD',
        symbol: 'tBTCUSD',
      },
    },
    {
      time: 20,
      payload: [1, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]],
    },
  ],
  '{"event":"unsubscribe","chanId":1}': [
    {
      time: 30,
      // not handle this case yet
      payload: {
        channel: 'ticker',
        event: 'unsubscribed',
        chanId: 1,
      },
    },
  ],
});
