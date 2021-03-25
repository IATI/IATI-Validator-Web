import { Component, OnInit, Input } from '@angular/core';
import { Feedback, Dqfs } from '../shared/feedback';
import { GuidanceService } from './../../../guidance.service';

@Component({
  selector: 'app-single-feedback',
  templateUrl: './single-feedback.component.html',
  styleUrls: ['./single-feedback.component.scss']
})
export class SingleFeedbackComponent implements OnInit {
  @Input() feedbackData: Feedback[] = [];
  @Input() title = '';
  @Input() item = 'activity';
  @Input() items = 'activities';
  public isCollapsed = false;

  constructor(private guidance: GuidanceService) { }

  ngOnInit() {
  }

  getIssueCount(type: string): number {
    let count = 0;

    this.feedbackData.forEach(fb => {
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

  collapse() {
    this.isCollapsed = ! this.isCollapsed;
  }
}
