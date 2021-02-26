import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { FeedbackGroupComponent } from '../feedback-group/feedback-group.component';
import { Activity, Dqfs } from '../shared/feedback';


@Component({
  selector: 'app-multi-feedback',
  templateUrl: './multi-feedback.component.html',
  styleUrls: ['./multi-feedback.component.scss']
})
export class MultiFeedbackComponent {
  @Input() activityData: Activity[] = [];
  @Input() title = '';
  @Input() item: 'activity' | 'organisation' = 'activity';
  @Input() items: 'activities' | 'organisations' = 'activities';
  @Input() dqfs: Dqfs | undefined; // TODO: verify undefined type
  @ViewChildren(FeedbackGroupComponent) groups: QueryList<FeedbackGroupComponent> | undefined; // TODO: verify undefined type
  isCollapsed = false;

  constructor() { }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.groups?.forEach(x => x.isCollapsed = this.isCollapsed);
  }
}
