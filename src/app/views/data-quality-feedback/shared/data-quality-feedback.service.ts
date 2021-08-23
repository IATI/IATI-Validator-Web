import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LogService } from '../../../core/logging/log.service';
import { Severity } from './severity';

@Injectable()
export class DataQualityFeedbackService {
  private urlApiValidationReport: string = window.__env.validatorServicesUrl + '/pub/validation/existing';
  private urlApiGuidanceLinks: string = window.__env.validatorServicesUrl + '/pvt/guidance-links';
  private apiKeyName: string = window.__env.validatorServicesKeyName;
  private apiKeyValue: string = window.__env.validatorServicesKeyValue;

  constructor(private http: HttpClient,
    private logger: LogService) { }

  getValidationReport(documentId: string): Observable<any> {
    const url: string = this.urlApiValidationReport + '?id=' + documentId;
    return this.http.get<any>(url, { headers: { [this.apiKeyName]: this.apiKeyValue }})
    .pipe(
      catchError(this.handleError('getValidationReport', undefined) as any)
    );
  }

  getTestValidationReport(guid: string): Observable<any> {
    const url: string = this.urlApiValidationReport + '?testfile=' + guid;
    return this.http.get<any>(url, { headers: { [this.apiKeyName]: this.apiKeyValue }})
    .pipe(
      catchError(this.handleError('getValidationReport', undefined) as any)
      );
  }

  getGuidanceLinks(version: string): Observable<any> {
    const url: string = this.urlApiGuidanceLinks + '/' + version;
    return this.http.get<any>(url,{ headers: { [this.apiKeyName]: this.apiKeyValue }})
    .pipe(
      catchError(this.handleError('getGuidanceLinks', undefined) as any)
    );
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
        slug: 'error',
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

  getCategoryLabel(category: string): string {
    const categories = {
      schema: 'Schema',
      information: 'Basic activity information',
      financial: 'Financial',
      identifiers: 'Identification',
      organisation: 'Basic organisation information',
      participating: 'Participating organisations',
      geo: 'Geopolitical information',
      classifications: 'Classifications',
      documents: 'Related documents',
      performance: 'Performance',
      iati: 'IATI file'
    };
    return categories[category];
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
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
