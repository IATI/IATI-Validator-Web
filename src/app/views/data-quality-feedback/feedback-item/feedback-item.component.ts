import { Component, OnInit, Input } from '@angular/core';
import { Feedback, Message } from '../shared/feedback';
import { DataQualityFeedbackService } from './../shared/data-quality-feedback.service';

@Component({
  selector: 'app-feedback-item',
  templateUrl: './feedback-item.component.html',
  styleUrls: ['./feedback-item.component.scss']
})
export class FeedbackItemComponent implements OnInit {
  @Input() feedback: Feedback;
  @Input() version = '';

  constructor(private dataQualityFeedbackService: DataQualityFeedbackService) {
   }

  ngOnInit() {
    this.sortData();
  }

  cleanVersion() {
    return this.version.replace('.', '');
  }
  sortData = () =>  {
    // Sort the messages based on severity
    this.feedback.errors.sort(this.compareSeverity);
  };

  compareSeverity = (a: Message, b: Message) => this.getSeverity(a) - this.getSeverity(b);

  getSeverity = (message: Message) => {
    if (message.severity === 'critical') {
      return 1;
    } else if (message.severity === 'error') {
      return 2;
    } else if (message.severity === 'warning') {
      return 2;
    } else if (message.severity === 'info') {
      return 3;
    } else if (message.severity === 'success') {
      return 4;
    } else {
      return 9;
    }
  };

  getfeedbackColor(message: Message): string {
    if (message.severity === 'error') {
      return 'error';
    } else if (message.severity === 'critical') {
      return 'critical';
    } else if (message.severity === 'warning') {
      return 'warning';
    } else if (message.severity === 'info') {
      return 'improvement';
    } else if (message.severity === 'success') {
      return 'notification';
    } else {
      return 'other';
    }
  }

  getCategoryLabel(category: string): string {
    return this.dataQualityFeedbackService.getCategoryLabel(category);
  }

}
