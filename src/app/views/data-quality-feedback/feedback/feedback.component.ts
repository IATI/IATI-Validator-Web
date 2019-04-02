import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';

import { FeedbackGroupComponent } from './../feedback-group/feedback-group.component';
import { LogService } from './../../../core/logging/log.service';
import { Dqfs, Activity, Feedback } from './../shared/feedback';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  @Input() activityData: Activity[];
  @ViewChildren(FeedbackGroupComponent) groups: QueryList<FeedbackGroupComponent>;
  isCollapsed = false;

  constructor(private logger: LogService) { }

  ngOnInit() {
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.groups.forEach(x => x.isCollapsed = this.isCollapsed);
  }



}
