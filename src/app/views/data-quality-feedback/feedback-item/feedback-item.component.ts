import { Component, OnInit, Input } from '@angular/core';
import { Feedback, Message } from '../shared/feedback';

@Component({
  selector: 'app-feedback-item',
  templateUrl: './feedback-item.component.html',
  styleUrls: ['./feedback-item.component.scss']
})
export class FeedbackItemComponent implements OnInit {
  @Input() feedback: Feedback;

  constructor() { }

  ngOnInit() {
    this.sortData();
  }

  sortData = () =>  {
    // Sort the messages based on severity
     this.feedback.messages.sort(this.compareSeverity);
  }

  compareSeverity = (a: Message, b: Message) => {
    return this.getSeverity(a) - this.getSeverity(b);
  }

  getSeverity = (message: Message) => {
    if (message.rulesets.some(x => x.severity === 'danger')) {
      return 1;
    } else if (message.rulesets.some(x => x.severity === 'warning')) {
      return 2;
    } else if (message.rulesets.some(x => x.severity === 'info')) {
      return 3;
    } else if (message.rulesets.some(x => x.severity === 'success')) {
      return 4;
    } else {
      return 9;
    }
  }

  getfeedbackColor(message: Message): string {
    if (message.rulesets.some(x => x.severity === 'danger')) {
      return 'error';
    } else if (message.rulesets.some(x => x.severity === 'warning')) {
      return 'warning';
    } else if (message.rulesets.some(x => x.severity === 'info')) {
      return 'improvement';
    } else if (message.rulesets.some(x => x.severity === 'success')) {
      return 'notification';
    } else {
      return 'other';
    }

  }

}
