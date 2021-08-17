import { Component, OnInit, Input } from '@angular/core';

import { LogService } from './../../../core/logging/log.service';
import { Activity } from './../shared/feedback';

@Component({
  selector: 'app-feedback-group',
  templateUrl: './feedback-group.component.html',
  styleUrls: ['./feedback-group.component.scss']
})
export class FeedbackGroupComponent implements OnInit {
  @Input() activity: Activity;
  @Input() item: 'activity' | 'organisation';
  @Input() items: 'activities' | 'organisations';
  @Input() organisationInfo = {} as any;
  @Input() version = '';
  @Input() guidanceLinks = {};

  public isCollapsed = false;

  constructor(private logger: LogService) { }

  ngOnInit() {
  }

  collapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  getLinkDportal(activity: string) {
    if (this.items === 'organisations') {
      return `http://d-portal.org/ctrack.html?publisher=${encodeURIComponent(activity)}`;
    } else if (this.organisationInfo != null && this.organisationInfo.iati_id) {
      // eslint-disable-next-line max-len
      return `http://d-portal.org/ctrack.html?publisher=${encodeURIComponent(this.organisationInfo.iati_id)}#view=act&aid=${encodeURIComponent(activity)}`;
    }
    return '';
  }

  getIssueCount(type): number {
    let count = 0;

    this.activity.errors.forEach(fb => {
      fb.errors.forEach(mes => {
        if (mes.severity === type) {
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
}
