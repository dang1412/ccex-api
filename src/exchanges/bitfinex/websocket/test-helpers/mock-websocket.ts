import { WebsocketRxJsMock } from '../../../../common';
import { WebsocketResponseI, WebsocketDataI } from '../bitfinex-websocket.type';

export const MOCK_SOCKET = new WebsocketRxJsMock<WebsocketResponseI | WebsocketDataI>({
  '{"channel":"ticker","symbol":"tBTCUSD","event":"subscribe"}': [
    {
      time: 1,
      payload: {
        channel: 'ticker',
        event: 'subscribed',
        chanId: 1,
        pair: 'BTCUSD',
        symbol: 'tBTCUSD',
      },
    },
    {
      time: 2,
      payload: [1, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]],
    },
  ],
  '{"event":"unsubscribe","chanId":1}': [
    {
      time: 1,
      // not handle this case yet
      payload: [] as any,
    },
  ],
});
