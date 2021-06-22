import { Injectable } from '@angular/core';

interface GtagOptions {
  event_category: string;
  event_label?: string;
  value?: number;
}

declare let gtag: (arg1: string, arg2: string, arg3: GtagOptions) => void;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  public eventEmitter(
    eventAction: string,
    eventCategory: string,
    eventLabel: string = null,
    eventValue: number = null ){
         gtag('event', eventAction, {
                 event_category: eventCategory,
                 event_label: eventLabel,
                 value: eventValue
               });
    }
}
