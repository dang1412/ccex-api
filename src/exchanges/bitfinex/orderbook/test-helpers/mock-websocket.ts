import { WebsocketRxJsMock } from '../../../../common';
import { WebsocketResponseI, WebsocketDataI } from '../../websocket';

export const MOCK_SOCKET = new WebsocketRxJsMock<WebsocketResponseI | WebsocketDataI>({
  '{"channel":"book","symbol":"tBTCUSD","prec":"P0","freq":"F0","len":"25","event":"subscribe"}': [
    {
      time: 1,
      payload: {
        event: 'subscribed',
        channel: 'book',
        chanId: 2032,
        symbol: 'tBTCUSD',
        prec: 'P0',
        freq: 'F0',
        len: '25',
        pair: 'BTCUSD',
      },
    },
    {
      time: 2,
      payload: [
        2032,
        [
          [
            3688.7,
            2,
            5.13034526,
          ],
          [
            3688.1,
            1,
            0.5,
          ],
          [
            3695.6,
            2,
            -1.2,
          ],
          [
            3696,
            1,
            -0.115,
          ],
        ],
      ],
    },
    {
      time: 2,
      payload: [
        2032,
        [
          3696,
          0,
          -1,
        ],
      ],
    },
    {
      time: 2,
      payload: [
        2032,
        [
          3688.7,
          1,
          2.11,
        ],
      ],
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
