/* eslint-disable @typescript-eslint/naming-convention */
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../../core/loader/loader.service';
import { OrganisationService } from '../../../organisation/shared/organisation.service';
import { ValidatedIatiService } from '../../../validate-iati/shared/validated-iati.service';
import { Activity, Dqfs, Feedback, Message, Report, Ruleset, ReportResponse } from '../shared/feedback';
import { Document } from 'src/app/shared/document';
import { Severity } from '../shared/severity';
import { LoaderState } from './../../../core/loader/loader';
import { LogService } from './../../../core/logging/log.service';
import { Category } from './../shared/category';
import { DataQualityFeedbackService } from './../shared/data-quality-feedback.service';
import { Source } from './../shared/source';
import { Organisation } from 'src/app/shared/organisation';
import * as _ from 'lodash';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  dataset = null;
  isLoading = false;
  data: Dqfs = {} as Dqfs;
  fileName = '';
  isTestfiles = false;
  tmpWorkspaceId = '';
  activityData: Activity[] = [];
  activities: Activity[] = [];
  companyFeedback: Feedback[] = [];
  severities: Severity[] = [];
  sources: Source[] = [];
  categories: Category[] = [];

  documentInfo: Document;
  organisationInfo: Organisation;
  validationReportResponse: ReportResponse = {} as ReportResponse;
  validationReport: Report = {} as Report;
  guidanceLinks = {};

  fileErrors: Feedback[] = [];
  fileErrorsOriginal: Feedback[] = [];
  activityErrors: Activity[] = [];
  activityErrorsOriginal: Activity[] = [];

  public dqfs: Dqfs | undefined;
  public fileType = '';
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
              this.dataQualityFeedbackService.getTestValidationReport(params['id']).subscribe(iatiTestDataSet => {
                const theFileId = iatiTestDataSet.guid;
                this.fileName = iatiTestDataSet.filename;
                this.tmpWorkspaceId = iatiTestDataSet.session_id;
                this.validationReport = iatiTestDataSet.report;
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
      this.documentInfo = undefined;
      this.organisationInfo = null;
      this.validationReportResponse = {document_url: null,
                                       registry_hash: null,
                                       registry_id: null,
                                       valid: this.validationReport.valid,
                                       report: this.validationReport};
      this.setData(null);
      this.loader.hide();
    } else {
      this.organisationService.getDocument(id).subscribe(documentInfo => {
        if (length in documentInfo && documentInfo.length === 1) {
          this.documentInfo = documentInfo[0];
          this.organisationService.getOrganisationById(this.documentInfo.publisher).subscribe(orgInfo => {
            if (length in orgInfo && orgInfo.length === 1) {
              this.organisationInfo = orgInfo[0];
              this.dataQualityFeedbackService.getValidationReport(id).subscribe(validationInfo => {
                if (validationInfo) {
                  this.validationReportResponse = validationInfo;
                  this.validationReport = this.validationReportResponse.report;
                  this.setData(null);
                } else {
                  this.documentInfo = undefined;
                  this.validationReportResponse = undefined;
                  this.loader.hide();
                }
                this.loader.hide();
              });
            } else {
              this.documentInfo = undefined;
              this.validationReportResponse = undefined;
              this.loader.hide();
            }
          });
        } else {
            this.documentInfo = undefined;
            this.validationReportResponse = undefined;
            this.loader.hide();
        }
      });
    }
  }

  setData(data: any) {
    this.fileType = this.validationReport.fileType;

    if ( ! this.isTestfiles) {
      if ('url' in this.documentInfo) {
        this.fileName = this.documentInfo.url.split('/').pop();
      } else {
        this.fileName = 'No filename available';
      }
    }

    this.fileErrors = this.validationReport.errors.reduce((acc, actOrgFile) => {
      if (actOrgFile.identifier === 'file') {
        return actOrgFile.errors;
       }
     return acc;
    }, []);

    this.fileErrorsOriginal = [...this.fileErrors];

    this.activityErrors = this.validationReport.errors.filter((actOrgFile) => actOrgFile.identifier !== 'file');
    this.activityErrorsOriginal = [...this.activityErrors];

    this.loadCategories();

    this.loadTypeMessages(this.validationReport.errors);

    this.filterActivities();

    this.loadGuidanceLinks(this.validationReport.iatiVersion);

    this.loader.hide();
  }

  loadGuidanceLinks(version: string) {
    this.dataQualityFeedbackService.getGuidanceLinks(version).subscribe(data => {
      if (data.version === version) {
        this.guidanceLinks = data;
      }
    });
  }

  loadCategories() {

    const uniqueCat: { id: string; name: string }[] = [];

    this.validationReport.errors.forEach(actOrgFile => {
      actOrgFile.errors.forEach(error => {
        if (uniqueCat.some(u => u.id === error.category)) {
          //nothing
        } else {
          uniqueCat.push({ id: error.category, name: this.dataQualityFeedbackService.getCategoryLabel(error.category) });
        }
      });
    });

    uniqueCat.forEach(u => {
      this.categories.push({ id: u.id, name: u.name, count: null, order: 0, show: true });
    });
  }

  loadTypeMessages(errors: any[]) {
    const types: { sev: string; id: string; text: string }[] = [];
    // Get unique messages, with the highest level of severity
    errors.forEach(actOrgFile => {
      actOrgFile.errors.forEach(errorCat => {
        errorCat.errors.forEach(error => {
          const { message, severity, id } = error;
          if (!types.some(t => t.id === id)) {
            const newType: { sev: string; id: string; text: string } = { sev: '', id: '', text: '' };
            newType.sev = severity;
            newType.id = id;
            newType.text = message;
            types.push(newType);
          }
        });
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
    let filtered = JSON.parse(JSON.stringify(this.activityErrorsOriginal));

    this.filterCompanyFeedback();

    // Filter feedback category
    filtered.forEach(act => {
      act.errors = act.errors.filter(this.filterCategory);
    });

    // Filter messages that are not selected in source
    // filtered.forEach(act => {
    //   act.errors.forEach(fb => {
    //     fb.errors.forEach(mes => {
    //       mes.rulesets = mes.rulesets.filter(this.filterSource);
    //     });
    //   });
    // });

    // Filter type messages selected
    filtered.forEach(act => {
      act.errors.forEach(fb => {
        fb.errors = fb.errors.filter(this.filterTypeMessage);
      });
    });

    // Filter messages with severity selected
    filtered.forEach(act => {
      act.errors.forEach(fb => {
        fb.errors = fb.errors.filter(this.filterSeverity);
      });
    });

    // Filter feedback whitout messages
    filtered.forEach(act => {
      act.errors = act.errors.filter(fb => fb.errors.length > 0);
    });

    // Filter activities without feedback
    filtered = filtered.filter(act => act.errors.length > 0);

    this.activityErrors = filtered;
    // set count on filter items
    this.setSeverityCount();
    this.setCategoryCount();
    this.setTypeMessageCount();
    this.loader.hide();
  }

  filterCompanyFeedback() {
    let filteredFeedback = JSON.parse(JSON.stringify(this.fileErrorsOriginal));

    // Filter feedback category
    filteredFeedback = filteredFeedback.filter(this.filterCategory);

    // Filter messages that are not selected in source
    // filteredFeedback.forEach(fb => {
    //   fb.errors.forEach(mes => {
    //     mes.rulesets = mes.rulesets.filter(this.filterSource);
    //   });
    // });

    // Filter type messages selected
    filteredFeedback.forEach(fb => {
      fb.errors = fb.errors.filter(this.filterTypeMessage);
    });

    // Filter errors with severity selected
    filteredFeedback.forEach(fb => {
      fb.errors = fb.errors.filter(this.filterSeverity);
    });

    // Filter feedback without errors
    filteredFeedback = filteredFeedback.filter(fb => fb.errors.length > 0);

    // Filter activities without feedback
    this.fileErrors = filteredFeedback;
  }

  filterSeverity = (message: Message) =>
    this.severities.some(sev => sev.show === true && sev.slug === message.severity);

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

  getIssueCount(severity: string): number {
    let count = 0;
    this.activityErrors.forEach(act => {
      act.errors.forEach(fb => {
        fb.errors.forEach(mes => {
          if (mes.severity === severity) {
            count += mes.context.length;
          }
        });
      });
    });

    this.fileErrors.forEach(fb => {
      fb.errors.forEach(mes => {
        if (mes.severity === severity) {
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
    this.validationReport.errors.forEach(actOrgFile => {
      actOrgFile.errors.forEach(errorCatGroup => {
        if (errorCatGroup.category === id) {
          count += errorCatGroup.errors.length;
        }
      });
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

    this.validationReport.errors.forEach(actOrgFile => {
      actOrgFile.errors.forEach(errorCatGroup => {
        errorCatGroup.errors.forEach((error) => {
          const { id } = error;
          if (typeId === id) {
            count += 1;
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

  fileStatus(): string {
    if (Object.keys(this.validationReport).length > 0){
      const error = this.validationReport.summary.error;
      const warning = this.validationReport.summary.warning;
      const valid = this.validationReport.valid;

      if (valid === true && error === 0 && warning === 0) {
        return 'success';
      } else if (valid === true && error === 0) {
        return 'warning';
      } else if (valid === true) {
        return 'error';
      } else {
        return 'critical';
      }
    }
    return '';
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
