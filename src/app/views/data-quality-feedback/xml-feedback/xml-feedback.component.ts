import { Component, OnInit, Input } from '@angular/core';
import { Feedback, Dqfs } from '../shared/feedback';

@Component({
  selector: 'app-xml-feedback',
  templateUrl: './xml-feedback.component.html',
  styleUrls: ['./xml-feedback.component.scss']
})
export class XmlFeedbackComponent implements OnInit {
  @Input() feedbackData: Feedback[];
  public isCollapsed = false;

  constructor() { }

  ngOnInit() {
  }

  getIssueCount(type): number {
    let count = 0;
    

    this.feedbackData.forEach(fb => {
      fb.messages.forEach(mes => {
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
