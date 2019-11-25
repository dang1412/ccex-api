import { ReplaySubject, Observable } from 'rxjs';
import { WebSocketRxJs } from './websocket-rxjs';

interface MockMessage<T> {
  // number in second
  time: number;
  // message payload
  payload: T | 'stop';
}

type MockOf<Class> = { [Member in keyof Class]: Class[Member] };

export interface MockDataScheme<T> {
  [key: string]: MockMessage<T>[];
}

export class WebsocketRxJsMock<T> implements MockOf<WebSocketRxJs> {
  private readonly data$ = new ReplaySubject<T>(1);

  get message$(): Observable<T> {
    return this.data$.asObservable();
  }

  constructor(private readonly mockDataScheme: MockDataScheme<T>) {
    if (mockDataScheme['default']) {
      this.receive(mockDataScheme.default);
    }
  }

  send(text: string): void {
    if (this.mockDataScheme[text]) {
      this.receive(this.mockDataScheme[text]);
    }
  }

  close(): void {
    this.data$.complete();
  }

  private receive(messages: MockMessage<T>[]): void {
    messages.forEach((m) => {
      setTimeout(() => {
        m.payload === 'stop' ? this.close() : this.data$.next(m.payload);
      }, m.time);
    });
  }
}
