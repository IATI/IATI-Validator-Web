import { Organisation } from './../../../organisation/shared/organisation';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/observable/of';

import { LogService } from '../../../core/logging/log.service';
import { Source } from './source';
import { Severity } from './severity';
import { Feedback, Dqfs, Activity } from './feedback';
import { IatiDataset } from './../../../organisation/shared/iati-dataset';
import { ReportInfo } from './report-info';


@Injectable()
export class DataQualityFeedbackService {
  private urlApiIatiFile: string = window.__env.apiDataworkBench + '/iati-files';
  private urlApiIatiTestFile: string = window.__env.apiDataworkBench + '/iati-testfiles';
  private urlApiIatiDataSet: string = window.__env.apiDataworkBench + '/iati-datasets';
  private urlApiOrganisation: string = window.__env.apiDataworkBench + '/iati-publishers';

  constructor(private http: HttpClient,
    private logger: LogService) { }

  getDataQualityFeedback(md5: string): Observable<Dqfs> {
    const url: string = this.urlApiIatiFile + '/file/json/' + md5 + '.json';
    //   /iati-files/{container}/download/{file}
    return this.http.get<any>(url)
      .pipe(
        // tap(_ => this.log(`fetched iati file`)),
        catchError(this.handleError('getIatiFile', undefined))
      );
  }

  getTestFilesDataQualityFeedbackById(inId: string): Observable<Dqfs> {
    const url: string = this.urlApiIatiTestFile + '/file/json/' + inId + '.json';
    //   /iati-testfiles/{container}/download/{file}
    return this.http.get<any>(url)
      .pipe(
        // tap(_ => this.log(`fetched iati file`)),
        catchError(this.handleError('getIatiFile', undefined))
      );
  }

  getReportInfo(md5: string): Observable<ReportInfo> {
    const reportInfo: ReportInfo = { organisationName: '', fileName: '', organisationSlug: '' };

    const url: string = this.urlApiIatiDataSet + '/findOne/' + '?filter[where][md5]=' + md5;
    this.http.get<IatiDataset>(url)
      .subscribe(
        data => {
          reportInfo.fileName = data.filename;
          reportInfo.organisationSlug = data.publisher;
          const urlPublisher: string = this.urlApiOrganisation + '/findOne/' + '?filter[where][slug]=' + data.publisher;
          this.http.get<Organisation>(urlPublisher)
            .subscribe(
              datas => {
                reportInfo.organisationName = datas.name;
                return Observable.of(reportInfo);
              }
            );
        }
      );
    return Observable.of(reportInfo);
  }

  getSeverities(): Severity[] {
    return [
      {
        id: 'critical',
        slug: 'critical',
        name: 'Critical',
        description: 'Files with critical errors will not be processed by the datastore',
        count: null,
        order: 1,
        show: true,
        types: []
      },
      {
        id: 'error',
        slug: 'danger',
        name: 'Errors',
        description: 'Errors make it hard or impossible to use the data.',
        count: null,
        order: 2,
        show: true,
        types: []
      },
      {
        id: 'warning',
        slug: 'warning',
        name: 'Warnings',
        description: 'Warnings indicate where the data can be more valuable.',
        count: null,
        order: 3,
        show: true,
        types: []
      },
      {
        id: 'improvement',
        slug: 'info',
        name: 'Improvements',
        description: 'Improvements can make the data more useful.',
        count: null,
        order: 4,
        show: true,
        types: []
      },
      {
        id: 'notification',
        slug: 'success',
        name: 'Notifications',
        description: 'Notifications are for your information.',
        count: null,
        order: 5,
        show: true,
        types: []
      },
    ];
  }

  getSources(): Source[] {
    return [
      { id: 'iati', slug: 'iati', name: 'IATI Standard', count: null, order: 1, show: true },
      { id: 'minbuza', slug: 'minbuza', name: 'Netherlands: Ministry of Foreign Affairs additional rules', count: null, order: 2, show: true },
      { id: 'dfid', slug: 'dfid', name: 'UK: Department for International Development (DFID) additional rules', count: null, order: 3, show: true },
      { id: 'practice', slug: 'practice', name: 'Common practice', count: null, order: 4, show: true },
      { id: 'iati-doc', slug: 'iati-doc', name: 'IATI Standard (additional)', count: null, order: 5, show: true },
    ];
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging
      this.logger.error(error);
      // console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
