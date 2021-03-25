import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GuidanceService {

  constructor() { }

// This is a hack to overcome the guidance links being hardcoded into the repos
  // and then baked into the thousands of reports. Done properly in V2
  overrideGuidanceLink(code) {
    const overrides = {
      '102.1.1': 'https://iatistandard.org/en/guidance/standard-guidance/activity-thematic-focus/',
      '103.1.1': 'https://iatistandard.org/en/guidance/standard-guidance/countries-regions/',
      '106.1.1': 'https://iatistandard.org/en/guidance/standard-guidance/activity-classifications/',
      '11.1.2': 'https://iatistandard.org/en/guidance/standard-guidance/activity-dates-status/',
      '11.1.3': 'https://iatistandard.org/en/guidance/standard-guidance/activity-dates-status/',
      '11.1.4': 'https://iatistandard.org/en/guidance/standard-guidance/activity-dates-status/',
      '11.1.5': 'https://iatistandard.org/en/guidance/standard-guidance/activity-dates-status/',
      '11.2.1': 'https://iatistandard.org/en/guidance/standard-guidance/financial-transactions/',
      '11.2.2': 'https://iatistandard.org/en/guidance/standard-guidance/financial-transactions/',
      '11.3.1': 'https://iatistandard.org/en/guidance/standard-guidance/organisation-budgets-spend/',
      '12.1.1': 'https://iatistandard.org/en/guidance/standard-guidance/countries-regions/',
      '12.1.2': 'https://iatistandard.org/en/guidance/standard-guidance/countries-regions/',
      '12.3.1': 'https://iatistandard.org/en/guidance/standard-guidance/activity-thematic-focus/',
      '12.3.2': 'https://iatistandard.org/en/guidance/standard-guidance/activity-thematic-focus/',
      '12.4.1': 'https://iatistandard.org/en/guidance/standard-guidance/countries-regions/',
      '2.1.1': 'https://iatistandard.org/en/guidance/standard-guidance/activity-thematic-focus/',
      '2.1.2': 'https://iatistandard.org/en/guidance/standard-guidance/activity-thematic-focus/',
      '2.1.4': 'https://iatistandard.org/en/guidance/standard-guidance/activity-thematic-focus/',
      '2.2.1': 'https://iatistandard.org/en/guidance/standard-guidance/activity-thematic-focus/',
      '3.1.1': 'https://iatistandard.org/en/guidance/standard-guidance/countries-regions/',
      '3.1.2': 'https://iatistandard.org/en/guidance/standard-guidance/countries-regions/',
      '3.1.4': 'https://iatistandard.org/en/guidance/standard-guidance/countries-regions/',
      '3.4.1': 'https://iatistandard.org/en/guidance/standard-guidance/countries-regions/',
      '3.4.2': 'https://iatistandard.org/en/guidance/standard-guidance/countries-regions/',
      '3.4.4': 'https://iatistandard.org/en/guidance/standard-guidance/countries-regions/',
      '3.6.2': 'https://iatistandard.org/en/guidance/standard-guidance/financial-transactions/',
      '3.7.1': 'https://iatistandard.org/en/guidance/standard-guidance/countries-regions/',
      '3.7.2': 'https://iatistandard.org/en/guidance/standard-guidance/countries-regions/',
      '6.1.5': 'https://iatistandard.org/en/guidance/standard-guidance/related-documents/',
      '6.10.1': 'https://iatistandard.org/en/guidance/standard-guidance/activity-participants/',
      '6.11.1': 'https://iatistandard.org/en/guidance/standard-guidance/activity-dates-status/',
      '6.13.1': 'https://iatistandard.org/en/guidance/standard-guidance/activity-classifications/',
      '6.14.1': 'https://iatistandard.org/en/guidance/standard-guidance/activity-classifications/',
      '6.2.1': 'https://iatistandard.org/en/guidance/standard-guidance/activity-dates-status/',
      '6.2.2': 'https://iatistandard.org/en/guidance/standard-guidance/activity-thematic-focus/',
      '6.6.2': 'https://iatistandard.org/en/guidance/standard-guidance/activity-thematic-focus/',
      '6.7.2': 'https://iatistandard.org/en/guidance/standard-guidance/activity-thematic-focus/',
      '7.5.2': 'https://iatistandard.org/en/guidance/standard-guidance/activity-budgets/',
      '7.5.3': 'https://iatistandard.org/en/guidance/standard-guidance/activity-budgets/',
      '8.6.3': 'https://iatistandard.org/en/guidance/standard-guidance/organisation-budgets-spend/'
    };

    if (code in overrides) {
      return overrides[code];
    }

    return null;
  }
}
