import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

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
];

// type MockOf<Class> = {
//   [Member in keyof Class]: Class[Member];
// };

// export class MockWebSocketRxJs implements MockOf<WebSocketRxJs> {
//   get message$(): Observable<any> {
//     return timer().pipe(map(i => MOCK_TICKER_DATA[i] as any));
//   }

//   close(): void { }

//   send(): void { }
// }

// export const MOCK_SOCKET = new MockWebSocketRxJs();

export const MOCK_SOCKET: any = {
  message$: timer().pipe(map(i => MOCK_TICKER_DATA[i] as any)),
  close: () => {},
};
