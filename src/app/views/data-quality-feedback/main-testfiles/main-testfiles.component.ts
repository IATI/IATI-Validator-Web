import { Component, OnInit } from '@angular/core';
import { LoaderState } from './../../../core/loader/loader';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { LogService } from './../../../core/logging/log.service';
import { DataQualityFeedbackService } from './../shared/data-quality-feedback.service';
import { Severity } from '../shared/severity';
import { Source } from './../shared/source';
import { Category } from './../shared/category';
import { TypeMessage } from './../shared/type-message';
import { TypeSeverity } from './../shared/type-severity';
import { Dqfs, Activity, Feedback, Context, Message, Ruleset } from '../shared/feedback';
import { LoaderService } from '../../../core/loader/loader.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-main-testfiles',
  templateUrl: './main-testfiles.component.html',
  styleUrls: ['./main-testfiles.component.scss']
})
export class MainTestfilesComponent implements OnInit {
  isLoading = false;
  fileName = '';
  activityData: Activity[] = [];
  activities: Activity[] = [];
  companyFeedbackData: Feedback[];
  companyFeedback: Feedback[];
  severities: Severity[] = [];
  sources: Source[] = [];
  categories: Category[] = [];
  public dqfs: Dqfs;
  public filetype = '';
  private loaderSubscription: Subscription;

  constructor(private dataQualityFeedbackService: DataQualityFeedbackService,
    private logger: LogService,
    private activateRoute: ActivatedRoute,
    private loader: LoaderService,
    private location: Location) {
 
  }

  ngOnInit() {
   
    this.loaderSubscription = this.loader.loaderState
      .subscribe((state: LoaderState) => {
        this.isLoading = state.show;
      });
    this.severities = this.dataQualityFeedbackService.getSeverities();
    this.sources = this.dataQualityFeedbackService.getSources();


    this.activateRoute
    .params
    .subscribe(params => {
      this.fileName = params['id'];

      const theFileId = this.fileName.split(".").shift();


      this.loadActivityData(theFileId);
    });



  }

  ngOnDestroy() {
    this.loaderSubscription.unsubscribe();

  }


  loadActivityData(inId: string) {
    this.loader.show();
    this.dataQualityFeedbackService.getTestFilesDataQualityFeedbackById(inId)
      .subscribe(
        data => {
          //TODO: Check for filetype
          console.log(data);
          this.filetype = data.filetype;
          if (data.filetype = "iati-activities") {
            if (data.activities) {
              this.activityData = data.activities;
            }
            if (data.feedback) {
              this.companyFeedbackData = data.feedback;
            }
          }

          if (data.filetype = "iati-organisations") {
            if (data.organisations) {
              this.activityData = data.organisations;
            }
          }

          if (data.filetype = "not-iati") {
            if (data.feedback) {
              this.companyFeedbackData = data.feedback;
            }
          }



          if (this.activityData === undefined && this.companyFeedbackData === undefined) {
            this.loader.hide();
            return;
          }
          this.loadCategories();
          this.loadTypeMessages(this.activityData, this.companyFeedbackData);
          this.filterActivities();

          this.loader.hide();
        },
        error => {
          this.logger.error('Error loadActivityData', error);
          this.loader.hide();
        }
      );
  }

  loadCategories() {

    const uniqueCat: { id: string, name: string }[] = [];

    this.activityData.forEach(act => {
      act.feedback.forEach(fb => {
        if (uniqueCat.some(u => u.id === fb.category)) {
          // nothing
        } else {
          uniqueCat.push({ id: fb.category, name: fb.label });
        }
      });
    });

    this.companyFeedbackData.forEach(element => {
      if (uniqueCat.some(u => u.id === element.category)) {
        // nothing
      } else {
        uniqueCat.push({ id: element.category, name: element.label });
      }
    });

    uniqueCat.forEach(u => {
      this.categories.push({ id: u.id, name: u.name, count: null, order: 0, show: true });
    });
  }

  loadTypeMessages(activities: Activity[], inCompanyFeedback: Feedback[]) {
    const types: { sev: string, id: string, text: string }[] = [];
    // Get unique messages, with the highest level of severity
    activities.forEach(act => {
      act.feedback.forEach(fb => {
        fb.messages.forEach(mes => {
          if (!types.some(t => t.id === mes.id)) {
            const newType: { sev: string, id: string, text: string } = { sev: '', id: '', text: '' };
            newType.sev = this.getfeedbackSeverity(mes);
            newType.id = mes.id;
            newType.text = mes.text;
            types.push(newType);
          }
        });
      });
    });

    inCompanyFeedback.forEach(fb => {
      fb.messages.forEach(mes => {
        if (!types.some(t => t.id === mes.id)) {
          const newType: { sev: string, id: string, text: string } = { sev: '', id: '', text: '' };
          newType.sev = this.getfeedbackSeverity(mes);
          newType.id = mes.id;
          newType.text = mes.text;
          types.push(newType);
        }
      });
    });

    // push the messages in the severity it belongs to
    types.forEach(t => {
      const sev = this.severities.find(s => s.id === t.sev);
      if (sev !== undefined) {
        sev.types.push({ id: t.id, text: t.text, show: true });
      }

    });

  }



  filterActivities() {
    this.loader.show();
    let filtered = cloneDeep(this.activityData);

    this.filterCompanyFeedback();

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

  filterCompanyFeedback() {
    let filteredFeedback = cloneDeep(this.companyFeedbackData);

    // Filter feedback category
    filteredFeedback = filteredFeedback.filter(this.filterCategory);


    // Filter messages that are not selected in source
    filteredFeedback.forEach(fb => {
      fb.messages.forEach(mes => {
        mes.rulesets = mes.rulesets.filter(this.filterSource);
      });
    });

    // Filter type messages selected
    filteredFeedback.forEach(fb => {
      fb.messages = fb.messages.filter(this.filterTypeMessage);
    });

    // Filter messages with severity selected
    filteredFeedback.forEach(fb => {
      fb.messages = fb.messages.filter(this.filterSeverity);
    })

    // Filter feedback without messages
    filteredFeedback = filteredFeedback.filter(fb => {
      return fb.messages.length > 0;
    });

    // Filter activities without feedback
    this.companyFeedback = filteredFeedback;
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
    // return this.typeMessages.some(t => t.types.some(m => m.show === true && m.id === message.id ) );
    return this.severities.some(t => t.types.some(m => m.show === true && m.id === message.id));
  }

  // Set the count of messages to the severity
  setSeverityCount() {
    this.severities.forEach(sev => {
      sev.count = sev.show ? this.getIssueCount(sev.slug) : null;
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

    this.companyFeedbackData.forEach(fb => {
      fb.messages.forEach(mes => {
        if (mes.rulesets.some(r => r.severity === type)) {
          count += mes.context.length;
        }
      });
    });
    return count;
  }

  // Set the count of messages to the sources
  setSourceCount() {
    this.sources.forEach(src => {
      src.count = src.show ? this.getSourceCount(src.slug) : null;
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
    this.companyFeedbackData.forEach(fb => {
      fb.messages.forEach(mes => {
        if (mes.rulesets.some(r => r.src === type)) {
          count += mes.context.length;
        }
      });
    })
    return count;
  }

  setCategoryCount() {
    this.categories.forEach(cat => {
      cat.count = cat.show ? this.getCategoryCount(cat.id) : null;
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

    this.companyFeedbackData.forEach(fb => {
      if (fb.category === id) {
        fb.messages.forEach(mes => {
          count += mes.context.length;
        });
      }
    })
    return count;
  }

  // Set the count of the type-messages and sort types by count desc
  setTypeMessageCount() {
    this.severities.forEach(t => {
      t.types.forEach(m => {
        m.count = m.show ? this.getTypeMessageCount(m.id) : null;
      });
    });
    // Sort Type messages inside severity. Type with more messages on top
    this.severities.forEach(s => {
      s.types.sort((a, b) => b.count - a.count);
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

    this.companyFeedbackData.forEach(fb => {
      fb.messages.forEach(mes => {
        if (mes.id === typeId) {
          count += mes.context.length;
        }
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
      return 'notification';
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

  goBack() {
    this.location.back();
  }

}
