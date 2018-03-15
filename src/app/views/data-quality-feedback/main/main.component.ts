import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LogService } from './../../../core/logging/log.service';
import { DataQualityFeedbackService } from './../shared/data-quality-feedback.service';
import { Severity } from '../shared/severity';
import { Source } from './../shared/source';
import { Category } from './../shared/category';
import { Dqfs, Activity, Feedback, Context, Message, Ruleset } from '../shared/feedback';
import { LoaderService } from '../../../core/loader/loader.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  dqfId = '';
  activities: Activity[] = [];
  dqfs: Dqfs;
  severities: Severity[] = [];
  sources: Source[] = [];
  categories: Category[] = [];

  constructor(private dataQualityFeedbackService: DataQualityFeedbackService,
    private logger: LogService,
    private activateRoute: ActivatedRoute,
    private loader: LoaderService) {

    this.activateRoute
      .params
      .subscribe(params => {
        this.dqfId = params['name'];
      });

  }

  ngOnInit() {
    this.severities = this.dataQualityFeedbackService.getSeverities();
    this.sources = this.dataQualityFeedbackService.getSources();
    this.loadDqfData(this.dqfId);
  }

  loadDqfData(id: string) {
    this.loader.show();
    this.dataQualityFeedbackService.getDqf(id)
      .subscribe(
        data => {
          this.dqfs = data;
          this.loader.hide();
          this.loadCategories();
          this.filterActivities();
        },
        error => {
          this.logger.error('Error loadDqfData', error);
          this.loader.hide();
        }
      );
  }

  loadCategories() {

    let uniqueCat: {id: string, name: string}[] = [];

    this.dqfs.activities.forEach( act => {
      act.feedback.forEach(fb => {
        if (uniqueCat.some(u => u.id === fb.category )) {
          // nothing
        } else {
          uniqueCat.push({ id: fb.category, name: fb.label  });
        }
      });
    });

    uniqueCat.forEach( u => {
      this.categories.push({id: u.id, name: u.name, count: null, order: 0, show: true});
    });

  }


  filterActivities() {
    this.loader.show();
    let filtered = cloneDeep(this.dqfs.activities);

    // Filter feedback category
    filtered.forEach(act => {
      act.feedback = act.feedback.filter(this.filterCategory);
    });

    // Filter messages that are not selected in source
    filtered.forEach(act => {
      act.feedback.forEach(fb => {
        fb.messages.forEach(mes => {
          mes.rulesets = mes.rulesets.filter(this.filterSource);
        });
      });
    });

    // Filter messages with severity selected
    filtered.forEach(act => {
      act.feedback.forEach(fb => {
        fb.messages = fb.messages.filter(this.filterSeverity);
      });
    });
    // Filter feedback whitout messages
    filtered.forEach(act => {
      act.feedback = act.feedback.filter(fb => {
        return fb.messages.length > 0;
      });
    });
    // Filter activities without feedback
    filtered = filtered.filter(act => {
      return act.feedback.length > 0;
    });

    this.activities = filtered;
    // set count on filter items
    this.setSeverityCount();
    this.setSourceCount();
    this.loader.hide();
  }


  filterSeverity = (message: Message) => {
    return message.rulesets.some(rs => {
      return this.severities.some(sev => sev.show === true && sev.slug === rs.severity);
    });
  }

  filterSource = (ruleset: Ruleset) => {
    return this.sources.some(s => s.show === true && s.slug === ruleset.src);
  }

  filterCategory = (feedback: Feedback) => {
    return this.categories.some(c => c.show === true && c.id === feedback.category);
  }

  // Set the count of messages to the severity
  setSeverityCount() {
    this.severities.forEach(sev => {
      sev.count = sev.show ? this.getIssueCount(sev.slug) : null ;
    });
  }

  getIssueCount(type): number {
    let count = 0;
    this.activities.forEach(act => {
      act.feedback.forEach(fb => {
        fb.messages.forEach(mes => {
          if (mes.rulesets.some(r => r.severity === type)) {
            count += mes.context.length;
          }
        });
      });
    });
    return count;
  }

  // Set the count of messages to the sources
  setSourceCount() {
    this.sources.forEach(src => {
      src.count = src.show ? this.getSourceCount(src.slug) : null ;
    });
  }

  getSourceCount(type): number {
    let count = 0;
    this.activities.forEach(act => {
      act.feedback.forEach(fb => {
        fb.messages.forEach(mes => {
          if (mes.rulesets.some(r => r.src === type)) {
            count += mes.context.length;
          }
        });
      });
    });
    return count;
  }

  severitySelectedChanged() {
    this.filterActivities();
  }

  sourceSelectedChanged() {
    this.filterActivities();
  }

  categorySelectedChanged() {
    this.filterActivities();
  }



}
