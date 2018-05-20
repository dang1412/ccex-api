import { Observable, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import Pubnub from 'pubnub';

export class PubnubRxJs {
  private pubnub: Pubnub;
  // use one subject for each distinct channel
  private channelSubjectMap: {[channel: string]: ReplaySubject<any>} = {};

  constructor(config: Pubnub.Config) {
    this.pubnub = new Pubnub(config);
    this.addEventListener();
  }

  /**
   * @param channel 
   */
  subscribeChannel<T>(channel: string): Observable<T> {
    this.pubnub.subscribe({
      channels: [channel]
    });

    return this.getChannelSubject(channel).pipe(filter(data => !!data));
  }

  /**
   * @param channel
   */
  unsubscribeChannel(channel: string) {
    this.pubnub.unsubscribe({
      channels: [channel]
    });
  }

  /**
   * Register message event listener for pubnub instance
   * @param {PUBNUB} pubnub
   */
  private addEventListener() {
    this.pubnub.addListener({
      status: function (statusEvent: any) {
        if (statusEvent.category === 'PNConnectedCategory') {
          console.log('PNConnectedCategory');
        }
      },
      message: messageEvent => {
        if (messageEvent && messageEvent.channel && messageEvent.message) {
          this.getChannelSubject(messageEvent.channel).next(messageEvent.message);
        }
      }
    });
  }

  private getChannelSubject(channel: string): ReplaySubject<any> {
    if (!this.channelSubjectMap[channel]) {
      this.channelSubjectMap[channel] = new ReplaySubject(1);
    }

    return this.channelSubjectMap[channel];
  }
}