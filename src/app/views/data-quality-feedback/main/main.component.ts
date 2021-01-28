import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../../core/loader/loader.service';
import { OrganisationService } from '../../../organisation/shared/organisation.service';
import { ValidatedIatiService } from '../../../validate-iati/shared/validated-iati.service';
import { Activity, Dqfs, Feedback, Message, Ruleset } from '../shared/feedback';
import { Severity } from '../shared/severity';
import { LoaderState } from './../../../core/loader/loader';
import { LogService } from './../../../core/logging/log.service';
import { Category } from './../shared/category';
import { DataQualityFeedbackService } from './../shared/data-quality-feedback.service';
import { Source } from './../shared/source';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  dataset = null;
  isLoading = false;
  data = {};
  fileName = '';
  isTestfiles = false;
  tmpWorkspaceId = '';
  activityData: Activity[] = [];
  activities: Activity[] = [];
  companyFeedbackData: Feedback[] = [];
  companyFeedback: Feedback[] = [];
  severities: Severity[] = [];
  sources: Source[] = [];
  categories: Category[] = [];
  public dqfs: Dqfs | undefined;
  public filetype = '';
  private loaderSubscription: Subscription | undefined;
  private paramsSubscription: Subscription | undefined;
  private qParamsSubscription: Subscription | undefined;

  constructor(private dataQualityFeedbackService: DataQualityFeedbackService,
    private validatedIatiService: ValidatedIatiService,
    private organisationService: OrganisationService,
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

    this.paramsSubscription = this.activateRoute
      .params
      .subscribe(params => {
        this.qParamsSubscription = this.activateRoute.queryParams.subscribe(
          qParams => {
            this.isTestfiles = qParams.isTestfiles;

            if (qParams.isTestfiles) {
              this.validatedIatiService.getIatiDatasetById(params['id']).subscribe(iatiTestDataSet => {

                const theFileId = iatiTestDataSet.fileid.split('.').shift();
                this.fileName = iatiTestDataSet.filename;
                this.tmpWorkspaceId = iatiTestDataSet.tmpworkspaceId;
                this.loadData(theFileId as string, qParams.isTestfiles);
              });
            } else {
              this.loadData(params['id'], qParams.isTestfiles);
            }
          }
        );
      });
  }

  ngOnDestroy() {
    this.loaderSubscription?.unsubscribe();
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();

    }
    if (this.qParamsSubscription) {
      this.qParamsSubscription.unsubscribe();

    }
  }

  loadData(id: string, isTestfiles: boolean) {
    this.loader.show();

    if (isTestfiles) {
      this.dataQualityFeedbackService.getTestFilesDataQualityFeedbackById(id).subscribe(data => {
            this.dataset = data as any;
            if (this.dataset) {
              (this.dataset as any)['filename'] = this.fileName;
            }
            this.setData(data);
          },
          error => {
            this.logger.error('Error loadActivityData', error);
            this.loader.hide();
    });
    } else {
      this.organisationService.getIatiDatasetById(id).subscribe(iatiDataSet => {
          this.dataset = iatiDataSet[0];
          this.dataQualityFeedbackService.getDataQualityFeedback(iatiDataSet[0].md5).subscribe(
            data => {
              this.setData(data);
            },
            error => {
              this.logger.error('Error loadActivityData', error);
              this.loader.hide();
            }
          );
      });
    }
  }

  setData(data: any) {
    this.data = data;
    this.fileName = this.dataset.filename;
    if (data.feedback) {
      this.companyFeedbackData = data.feedback;
    }

    this.filetype = data.filetype;
    if (data.filetype === 'iati-activities') {
      if (data.activities) {
        this.activityData = data.activities;
      }
    }

    if (data.filetype === 'iati-organisations') {
      if (data.organisations) {
        this.activityData = data.organisations;
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
  }

  loadCategories() {

    const uniqueCat: { id: string; name: string }[] = [];

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
    const types: { sev: string; id: string; text: string }[] = [];
    // Get unique messages, with the highest level of severity
    activities.forEach(act => {
      act.feedback.forEach(fb => {
        fb.messages.forEach(mes => {
          if (!types.some(t => t.id === mes.id)) {
            const newType: { sev: string; id: string; text: string } = { sev: '', id: '', text: '' };
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
          const newType: { sev: string; id: string; text: string } = { sev: '', id: '', text: '' };
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
      act.feedback = act.feedback.filter(fb => fb.messages.length > 0);
    });

    // Filter activities without feedback
    filtered = filtered.filter(act => act.feedback.length > 0);

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
    });

    // Filter feedback without messages
    filteredFeedback = filteredFeedback.filter(fb => fb.messages.length > 0);

    // Filter activities without feedback
    this.companyFeedback = filteredFeedback;
  }

  filterSeverity = (message: Message) =>
    message.rulesets.some(rs => this.severities.some(sev => sev.show === true && sev.slug === rs.severity));

  filterSource = (ruleset: Ruleset) => this.sources.some(s => s.show === true && s.slug === ruleset.src);

  filterCategory = (feedback: Feedback) => this.categories.some(c => c.show === true && c.id === feedback.category);

  filterTypeMessage = (message: Message) =>
    // return this.typeMessages.some(t => t.types.some(m => m.show === true && m.id === message.id ) );
    this.severities.some(t => t.types.some(m => m.show === true && m.id === message.id))
  ;

  // Set the count of messages to the severity
  setSeverityCount() {
    this.severities.forEach(sev => {
      sev.count = sev.show ? this.getIssueCount(sev.slug) : null;
    });
  }

  getIssueCount(severity): number {
    let count = 0;
    this.activities.forEach(act => {
      act.feedback.forEach(fb => {
        fb.messages.forEach(mes => {
          if (mes.rulesets.some(r => r.severity === severity)) {
            count += mes.context.length;
          }
        });
      });
    });

    this.companyFeedbackData.forEach(fb => {
      fb.messages.forEach(mes => {
        if (mes.rulesets.some(r => r.severity === severity)) {
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
    });
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
    });
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
    } else if (message.rulesets.some(x => x.severity === 'critical')) {
      return 'critical';
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
