import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap, map, mergeMap } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { LogService } from './../../core/logging/log.service';
import { Organisation } from '../../shared/organisation';
import { Document } from '../../shared/document';
import { Workspace } from '../../shared/workspace';

@Injectable()
export class OrganisationService {
  private urlApiOrganisationVS: string = window.__env.validatorServicesUrl + '/pvt/publishers';
  private urlApiDocumentVS: string = window.__env.validatorServicesUrl + '/pvt/documents';

  constructor(
    private http: HttpClient,
    private logger: LogService,
  ) { }

  getOrganisationAndDocuments(name: string): Observable<Organisation> {
    return this.getOrganisationByName(name)
        .pipe(mergeMap(data => {
          if (data.length > 0) {
            const org = data[0];
            const workspaces: Workspace[] = [{
              slug: 'public',
              'owner-slug': name,
              title: 'Public data',
              description: 'IATI files published in the IATI Registry',
              id: org.iati_id,
              'iati-publisherId':
               org.iati_id,
               versions: null,
            }];
            return this.getOrganisationDocuments(org.org_id)
              .pipe(map((documents) => ({...org, workspaces, documents})));
          }
          return [];
        }));
  }

  getOrganisationByName(name: string): Observable<Organisation[]> {
    const url: string = this.urlApiOrganisationVS + '/' + name + '?lookupKey=name' ;
    this.log(url);
    return this.http.get<Organisation>(url)
      .pipe(
        tap(_ => this.log(`fetched organisation`)),
        catchError(this.handleError('getOrganisationByName', undefined))
      );
  }

  getOrganisationById(id: string): Observable<Organisation[]> {
    const url: string = this.urlApiOrganisationVS + '/' + id + '?lookupKey=id' ;
    this.log(url);
    return this.http.get<Organisation>(url)
      .pipe(
        tap(_ => this.log(`fetched organisation`)),
        catchError(this.handleError('getOrganisationById', undefined))
      );
  }

  getDocument(documentId: string): Observable<Document[]> {
    const url: string = this.urlApiDocumentVS + '/' + documentId ;
    this.log(url);
    return this.http.get<Document>(url)
      .pipe(
        tap(_ => this.log(`fetched document`)),
        catchError(this.handleError('getDocumentInfo', undefined))
      );
  }

  getOrganisationDocuments(organisationId: string): Observable<Document[]> {
    const url: string = this.urlApiOrganisationVS + '/' + organisationId + '/documents';
    this.log(url);
    return this.http.get<Document[]>(url)
      .pipe(
        tap(_ => this.log(`fetched documents`)),
        catchError(this.handleError('getOrganisationDocuments', []))
      );
  }

  private log(message: string) {
    if (!environment.production) {
      this.logger.debug(message);
    }
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
