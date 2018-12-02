// RxJs wrapper for pubnub

import { Observable, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import * as Pubnub from 'pubnub';

export class PubnubRxJs {
  private readonly pubnub: Pubnub;
  // use one subject for each distinct channel
  private readonly channelSubjectMap: { [channel: string]: ReplaySubject<any> } = {};

  constructor(config: Pubnub.PubnubConfig) {
    this.pubnub = new Pubnub(config);
    this.addEventListener();
  }

  /**
   * @param channel
   */
  subscribeChannel<T>(channel: string): Observable<T> {
    this.pubnub.subscribe({
      channels: [channel],
    });

    return this.getChannelSubject(channel).pipe(filter((data) => !!data));
  }

  /**
   * @param channel
   */
  unsubscribeChannel(channel: string): void {
    this.pubnub.unsubscribe({
      channels: [channel],
    });
  }

  /**
   * Register message event listener for pubnub instance
   * @param {PUBNUB} pubnub
   */
  private addEventListener(): void {
    this.pubnub.addListener({
      status: (statusEvent: any) => {
        if (statusEvent.category === 'PNConnectedCategory') {
          // pubnub connected
        }
      },
      message: (messageEvent) => {
        if (messageEvent && messageEvent.channel && messageEvent.message) {
          this.getChannelSubject(messageEvent.channel).next(messageEvent.message);
        }
      },
    });
  }

  private getChannelSubject(channel: string): ReplaySubject<any> {
    if (!this.channelSubjectMap[channel]) {
      this.channelSubjectMap[channel] = new ReplaySubject(1);
    }

    return this.channelSubjectMap[channel];
  }
}
