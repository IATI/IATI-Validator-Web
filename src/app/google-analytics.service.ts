import { Injectable } from '@angular/core';

interface gtagOptions {
  eventCategory: string,
  eventLabel?: string,
  eventAction: string,
  eventValue?: number
}

declare let gtag: (arg1: string, arg2: string, arg3: gtagOptions) => void;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  public eventEmitter(
    eventName: string,
    eventCategory: string,
    eventAction: string,
    eventLabel: string = null,
    eventValue: number = null ){
         gtag('event', eventName, {
                 eventCategory: eventCategory,
                 eventLabel: eventLabel,
                 eventAction: eventAction,
                 eventValue: eventValue
               })
    }
}
