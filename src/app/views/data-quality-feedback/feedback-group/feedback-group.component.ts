import { Component, OnInit, Input } from '@angular/core';

import { LogService } from './../../../core/logging/log.service';
import { Dqfs, Activity } from './../shared/feedback';
import { GuidanceService } from './../../../guidance.service';

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

  constructor(private logger: LogService, private guidance: GuidanceService) { }

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

    this.activity.feedback.forEach(fb => {
      fb.messages.forEach(mes => {
        const override = this.guidance.overrideGuidanceLink(mes.id);

        mes.rulesets.forEach(ruleset => {
          if (override != null) {
            ruleset['src'] = override;
          } else {
            ruleset['src'] = ruleset['href'];
          }
        });

        if (mes.rulesets.some(r => r.severity === type)) {
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
