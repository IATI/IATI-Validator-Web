import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LogService } from './../../../core/logging/log.service';
import { DataQualityFeedbackService } from './../shared/data-quality-feedback.service';
import { Severity } from '../shared/severity';
import { Source } from './../shared/source';
import { Category } from './../shared/category';
import { TypeSeverity, TypeMessage } from './../shared/type-message';
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
  typeMessages: TypeSeverity[] = [];

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
          // this.addCountContextFunctions();

          this.loadCategories();
          this.loadTypeMessages(this.dqfs.activities);
          this.filterActivities();
          this.loader.hide();
        },
        error => {
          this.logger.error('Error loadDqfData', error);
          this.loader.hide();
        }
      );
  }

  loadCategories() {

    const uniqueCat: {id: string, name: string}[] = [];

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

  loadTypeMessages(activities: Activity[]) {
    const types: {sev: string, id: string, text: string}[] = [];
    // Get unique messages, with the highest level of severity
    activities.forEach(act => {
      act.feedback.forEach(fb => {
        fb.messages.forEach(mes => {
          if (!types.some(t => t.id === mes.id)) {
            const newType: {sev: string, id: string, text: string} = {sev: '', id: '', text: ''} ;
            newType.sev = this.getfeedbackSeverity(mes);
            newType.id = mes.id;
            newType.text = mes.text;
            types.push(newType);
          }
        });
      });
    });

    // empty the current array
    this.typeMessages.length = 0;
    // create the 4 levels of severity and save a reference in a variable
    const errors = this.typeMessages[  this.typeMessages.push({ severity: 'error', order: 1, types: [], show: true }) - 1 ];
    const warnings = this.typeMessages[ this.typeMessages.push({ severity: 'warning', order: 2, types: [], show: true }) - 1 ];
    const improvements = this.typeMessages[ this.typeMessages.push({ severity: 'improvement', order: 3, types: [], show: true }) - 1 ];
    const optimisations = this.typeMessages [ this.typeMessages.push({ severity: 'optimisation', order: 4, types: [], show: true }) - 1 ];

    // push the messages in the severity it belongs to
    types.forEach(t => {
      if (t.sev === 'error') {
        errors.types.push({ id: t.id, text: t.text, show: true });
      } else if (t.sev === 'warning') {
        warnings.types.push({ id: t.id, text: t.text, show: true });
      } else if (t.sev === 'improvement') {
        improvements.types.push({ id: t.id, text: t.text, show: true });
      } else if (t.sev === 'optimisation' ) {
        optimisations.types.push({ id: t.id, text: t.text, show: true });
      }
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

    // Filter type messages selected
    filtered.forEach(act => {
      act.feedback.forEach(fb => {
        fb.messages = fb.messages.filter(this.filterTypeMessage);
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
    this.setCategoryCount();
    // this.loadTypeMessages(this.activities);
    this.setTypeMessageCount();
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

  filterTypeMessage = (message: Message) => {
    return this.typeMessages.some(t => t.types.some(m => m.show === true && m.id === message.id ) );
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

  setCategoryCount() {
    this.categories.forEach(cat => {
      cat.count = cat.show ? this.getCategoryCount(cat.id) : null ;
    });
  }

  getCategoryCount(id: string): number {
    let count = 0;
    this.activities.forEach(act => {
      act.feedback.forEach(fb => {
        if (fb.category === id) {
          fb.messages.forEach(mes => {
            count += mes.context.length;
          });
        }
      });
    });
    return count;
  }

  // Set the count of the type-messages
  setTypeMessageCount() {
    this.typeMessages.forEach(t => {
      t.types.forEach(m => {
        m.count = m.show ? this.getTypeMessageCount(m.id) : null ;
      });
    });
  }

  getTypeMessageCount(typeId: string): number {
    let count = 0;
    this.activities.forEach(act => {
      act.feedback.forEach(fb => {
        fb.messages.forEach(mes => {
          if (mes.id === typeId) {
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

  typesSelectedChanged() {
    this.filterActivities();
  }

  getfeedbackSeverity(message: Message): string {
    if (message.rulesets.some(x => x.severity === 'danger')) {
      return 'error';
    } else if (message.rulesets.some(x => x.severity === 'warning')) {
      return 'warning';
    } else if (message.rulesets.some(x => x.severity === 'info')) {
      return 'improvement';
    } else if (message.rulesets.some(x => x.severity === 'success')) {
      return 'optimisation';
    } else {
      return 'other';
    }

  }

  // addCountContextFunctions() {
  //   this.dqfs.activities.forEach( act => {
  //     act.feedback.forEach(fb => {

  //       fb.countContext = function () {
  //         let count = 0;
  //         fb.messages.forEach( mes => {
  //           count += mes.countContext();
  //         });
  //         return count;
  //        } ;

  //       fb.messages.forEach(mes => {
  //         mes.countContext = function () { return mes.context.length; };
  //       });
  //     });
  //   });
  // }

}
