import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Document } from '../../shared/document';
import { environment } from './../../../environments/environment';
import { LogService } from './../../core/logging/log.service';

@Injectable()
export class DocumentService {
  private urlApiDocumentVS: string = window.__env.validatorServicesUrl + '/pvt/documents';
  private apiKeyName: string = window.__env.validatorServicesKeyName;
  private apiKeyValue: string = window.__env.validatorServicesKeyValue;

  constructor(private http: HttpClient, private logger: LogService) {}

  getDocument(documentId: string): Observable<Document[]> {
    const url: string = this.urlApiDocumentVS + '/' + documentId;
    this.log(url);
    return this.http.get<Document>(url, { headers: { [this.apiKeyName]: this.apiKeyValue } }).pipe(
      tap((_) => this.log(`fetched document`)),
      catchError(this.handleError('DocumentService.getDocument', undefined))
    );
  }

  getDocumentStatus(document: Document, display = false) {
    const { report } = document;
    const { valid } = report || { valid: null };
    const { error, warning } = report ? report.summary : { error: -1, warning: -1 };

    if (document.report === null) {
      return display ? 'N/A' : 'normal';
    }
    if (valid === true && error === 0 && warning === 0) {
      return display ? 'Success' : 'success';
    }
    if (valid === true && error === 0) {
      return display ? 'Warning' : 'warning';
    }
    if (valid === true) {
      return display ? 'Error' : 'error';
    }
    if (valid === false) {
      return display ? 'Critical' : 'critical';
    }

    return display ? 'N/A' : 'normal';
  }

  getDocumentDatastoreAvailability(document: Document, fileStatus: string) {
    /* see this ticket for full explanation on these availability statuses
    https://trello.com/c/XeovXQrf/232-front-end-indicator-that-file-is-partially-in-ds-for-al-validation */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { report, solrize_end, alv_end, alv_start, alv_error } = document;

    if (solrize_end) {
      const formatedDate = formatDate(solrize_end, 'yyyy-MM-dd HH:mm (z)', 'en-US');

      return `${fileStatus === 'critical' && alv_end ? 'Partial' : 'Yes'} - ${formatedDate}`;
    }

    if (
      fileStatus === 'critical' &&
      ((report?.fileType === 'iati-activities' && !alv_start) || alv_error === 'No valid activities')
    ) {
      return 'No';
    }

    if (
      (report?.fileType === 'iati-activities' && fileStatus !== 'critical') ||
      (report?.fileType === 'iati-activities' &&
        fileStatus === 'critical' &&
        !alv_start &&
        report?.iatiVersion !== '' &&
        report?.iatiVersion !== '1*' &&
        this.checkDocumentHasErrorVersions(['0.6.1', '0.2.1', '0.1.1'], report?.errors)) ||
      (fileStatus === 'critical' && alv_end)
    ) {
      return 'Pending';
    }

    if (document.report?.fileType === 'iati-organisations') {
      return 'N/A';
    }

    return '';
  }

  private log(message: string) {
    if (!environment.production) {
      this.logger.debug(message);
    }
  }

  private checkDocumentHasErrorVersions(versions: string[], errors?: { identifier: string }[]): boolean {
    return !!(errors && errors.find((error) => versions.includes(error.identifier))); // TODO: check with Nick if identifier == id
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
      this.logger.error(error);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
