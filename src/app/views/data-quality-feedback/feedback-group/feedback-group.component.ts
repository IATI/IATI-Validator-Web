import { Component, OnInit, Input } from '@angular/core';

import { LogService } from './../../../core/logging/log.service';
import { Dqfs, Activity } from './../shared/feedback';

@Component({
  selector: 'app-feedback-group',
  templateUrl: './feedback-group.component.html',
  styleUrls: ['./feedback-group.component.scss']
})
export class FeedbackGroupComponent implements OnInit {
  @Input() activity: Activity;
  @Input() item: 'activity' | 'organisation';
  @Input() items: 'activities' | 'organisations';
  @Input() dqfs: Dqfs;

  public isCollapsed = false;

  constructor(private logger: LogService) { }

  ngOnInit() {
  }

  collapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  getLinkDportal(publisher: string, activity: string) {
    if (this.dqfs && this.dqfs.filetype === 'iati-organisations') {
      return `http://d-portal.org/ctrack.html?publisher=${encodeURIComponent(publisher)}`;
    } else {
      return `http://d-portal.org/ctrack.html?publisher=${encodeURIComponent(publisher)}#view=act&aid=${encodeURIComponent(activity)}`;
    }
  }

  getIssueCount(type): number {
    let count = 0;

    this.activity.errors.forEach(fb => {
      fb.errors.forEach(mes => {
        if (mes.severity === type) {
          // const override = this.overrideGuidanceLink(mes.id);

          // if (override != null) {
          //   mes.rulesets.forEach(ruleset => {
          //     ruleset['href'] = override;
          //   });
          // }

          count += mes.context.length;
        }
      });
    });
    return count;
  }

  // clean identiefier that contain new line breaks.
  // Delete the part from and after the line break.
  cleanIdentifier(identifier: string): string {
    const newLineFound = identifier.indexOf('\n');
    if (newLineFound >= 0) {
      return identifier.substring(0, newLineFound);
    } else {
      return identifier;
    }
  }

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
