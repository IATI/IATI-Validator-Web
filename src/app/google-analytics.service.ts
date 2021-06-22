import { Injectable } from '@angular/core';

interface GtagOptions {
/* eslint-disable @typescript-eslint/naming-convention */
  event_category: string;
  event_label?: string;
/* eslint-enable @typescript-eslint/naming-convention */
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
/* eslint-disable @typescript-eslint/naming-convention */
                 event_category: eventCategory,
                 event_label: eventLabel,
/* eslint-enable @typescript-eslint/naming-convention */
                 value: eventValue
               });
    }
}
