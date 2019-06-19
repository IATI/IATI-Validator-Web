import { Component, OnInit, Input } from '@angular/core';

import { LogService } from './../../../core/logging/log.service';
import { Dqfs, Activity } from './../shared/feedback';

@Component({
  selector: 'app-feedback-group',
  templateUrl: './feedback-group.component.html',
  styleUrls: ['./feedback-group.component.scss']
})
export class FeedbackGroupComponent implements OnInit {
  @Input() activity: Activity;
  @Input() dqfs:Dqfs; 

  public isCollapsed = false;

  constructor(private logger: LogService) { }

  ngOnInit() {
  }

  collapse() {
    this.isCollapsed = ! this.isCollapsed;
  }

  getLinkDportal(publisher, activity) {
    if(this.dqfs && this.dqfs.filetype==='iati-organisations'){
      return `http://d-portal.org/ctrack.html?publisher=${publisher}`
    }else{   return `http://d-portal.org/ctrack.html?publisher=${publisher}#view=act&aid=${activity}`;
  }

  }

  getIssueCount(type): number {
    let count = 0;

    this.activity.feedback.forEach(fb => {
      fb.messages.forEach(mes => {
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
    if ( newLineFound >= 0 ) {
      return identifier.substring(0, newLineFound);
    } else {
      return identifier;
    }
  }

}
