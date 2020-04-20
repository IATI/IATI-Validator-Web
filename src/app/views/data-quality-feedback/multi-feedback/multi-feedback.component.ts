import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';

import { FeedbackGroupComponent } from '../feedback-group/feedback-group.component';
import { LogService } from '../../../core/logging/log.service';
import { Dqfs, Activity, Feedback } from '../shared/feedback';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-multi-feedback',
  templateUrl: './multi-feedback.component.html',
  styleUrls: ['./multi-feedback.component.scss']
})
export class MultiFeedbackComponent {
  @Input() activityData: Activity[];
  @Input() title = '';
  @Input() item = 'activity';
  @Input() items = 'activities';
  @Input() dqfs: Dqfs;
  @ViewChildren(FeedbackGroupComponent) groups: QueryList<FeedbackGroupComponent>;
  isCollapsed = false;

  constructor() { }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.groups.forEach(x => x.isCollapsed = this.isCollapsed);
  }
}
