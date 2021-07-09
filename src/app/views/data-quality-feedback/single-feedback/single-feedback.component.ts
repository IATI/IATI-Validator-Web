import { Component, OnInit, Input } from '@angular/core';
import { Feedback } from '../shared/feedback';

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

  constructor() { }

  ngOnInit() {
  }

  getIssueCount(type: string): number {
    let count = 0;

    this.feedbackData.forEach(catGroup => {
      catGroup.errors.forEach(err => {
        if (err.severity === type) {
          count += err.context.length;
        }
      });
    });
    return count;
  }

  collapse() {
    this.isCollapsed = ! this.isCollapsed;
  }
}
