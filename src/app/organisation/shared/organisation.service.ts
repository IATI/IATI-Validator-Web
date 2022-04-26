import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { Document } from '../../shared/document';
import { Organisation } from '../../shared/organisation';
import { Workspace } from '../../shared/workspace';
import { environment } from './../../../environments/environment';
import { LogService } from './../../core/logging/log.service';

@Injectable()
export class OrganisationService {
  private urlApiOrganisationVS: string = window.__env.validatorServicesUrl + '/pvt/publishers';
  private urlApiDocumentVS: string = window.__env.validatorServicesUrl + '/pvt/documents';
  private apiKeyName: string = window.__env.validatorServicesKeyName;
  private apiKeyValue: string = window.__env.validatorServicesKeyValue;

  constructor(private http: HttpClient, private logger: LogService) {}

  getOrganisationAndDocuments(name: string): Observable<Organisation> {
    return this.getOrganisationByName(name).pipe(
      mergeMap((data) => {
        if (data.length > 0) {
          const org = data[0];
          const workspaces: Workspace[] = [
            {
              slug: 'public',
              'owner-slug': name,
              title: 'Public data',
              description: 'IATI files published in the IATI Registry',
              id: org.iati_id,
              'iati-publisherId': org.iati_id,
              versions: null,
            },
          ];
          return this.getOrganisationDocuments(org.org_id).pipe(
            map((documents) => ({ ...org, workspaces, documents }))
          );
        }
        return [];
      })
    );
  }

  getOrganisationByName(name: string): Observable<Organisation[]> {
    const url: string = this.urlApiOrganisationVS + '/' + name + '?lookupKey=name';
    this.log(url);
    return this.http
      .get<Organisation>(url, { headers: { [this.apiKeyName]: this.apiKeyValue } })
      .pipe(
        tap((_) => this.log(`fetched organisation`)),
        catchError(this.handleError('getOrganisationByName', undefined))
      );
  }

  getOrganisationById(id: string): Observable<Organisation[]> {
    const url: string = this.urlApiOrganisationVS + '/' + id + '?lookupKey=id';
    this.log(url);
    return this.http
      .get<Organisation>(url, { headers: { [this.apiKeyName]: this.apiKeyValue } })
      .pipe(
        tap((_) => this.log(`fetched organisation`)),
        catchError(this.handleError('getOrganisationById', undefined))
      );
  }

  getDocument(documentId: string): Observable<Document[]> {
    const url: string = this.urlApiDocumentVS + '/' + documentId;
    this.log(url);
    return this.http.get<Document>(url, { headers: { [this.apiKeyName]: this.apiKeyValue } }).pipe(
      tap((_) => this.log(`fetched document`)),
      catchError(this.handleError('getDocumentInfo', undefined))
    );
  }

  getOrganisationDocuments(organisationId: string): Observable<Document[]> {
    const url: string = this.urlApiOrganisationVS + '/' + organisationId + '/documents';
    this.log(url);
    return this.http
      .get<Document[]>(url, { headers: { [this.apiKeyName]: this.apiKeyValue } })
      .pipe(
        tap((_) => this.log(`fetched documents`)),
        catchError(this.handleError('getOrganisationDocuments', []))
      );
  }

  getDocumentDatastoreAvailability(document: Document, fileStatus: string) {
    /* see this ticket for full explanation on these availability statuses
    https://trello.com/c/XeovXQrf/232-front-end-indicator-that-file-is-partially-in-ds-for-al-validation */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { report, solrize_end, alv_end, alv_start, alv_error } = document;

    if (solrize_end) {
      const formatedDate = formatDate(
        solrize_end,
        'yyyy-MM-dd HH:mm (z)',
        new Intl.NumberFormat().resolvedOptions().locale
      );

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
