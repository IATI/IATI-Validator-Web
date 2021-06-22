import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap, map, mergeMap } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { LogService } from './../../core/logging/log.service';
import { IatiDataset } from './iati-dataset';
import { Organisation } from '../../shared/organisation';
import { Document } from '../../shared/document';
import { Version } from '../../shared/version';
import { Workspace } from '../../shared/workspace';
import { OrganisationsService } from '../../organisations/shared/organisations.service';

@Injectable()
export class OrganisationService {
  private urlApiIatiDataset: string = window.__env.apiDataworkBench + '/iati-datasets';
  private urlApiIatiFile: string = window.__env.apiDataworkBench + '/iati-files';

  private urlApiOrganisationVS: string = window.__env.validatorServicesUrl + '/pvt/publishers';

  constructor(
    private http: HttpClient,
    private logger: LogService,
    private allOrganisations: OrganisationsService
  ) { }

  getOrganisationAndDocuments(name: string): Observable<Organisation> {
    return this.getOrganisation(name)
        .pipe(mergeMap(data => {
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
        }));
  }

  getOrganisation(name: string): Observable<Organisation> {
    const url: string = this.urlApiOrganisationVS + '/' + name + '?lookupKey=name' ;
    this.log(url);
    return this.http.get<Organisation>(url)
      .pipe(
        tap(_ => this.log(`fetched organisation`)),
        catchError(this.handleError('getOrganisation', undefined))
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

  getIatiDataset(md5: string): Observable<IatiDataset[]> {
    const url: string = this.urlApiIatiDataset + '/?filter[where][md5]=' + md5;

    this.log(url);
    return this.http.get<IatiDataset>(url)
      .pipe(
        tap(_ => this.log(`fetched iati dataset`)),
        catchError(this.handleError('getIatiDataset', undefined))
      );
  }

  getIatiDatasetById(id: string): Observable<IatiDataset[]> {
    const url: string = this.urlApiIatiDataset + '/?filter[where][id]=' + id;

    this.log(url);
    return this.http.get<IatiDataset[]>(url)
      .pipe(
        tap(_ => this.log(`fetched iati dataset`)),
        catchError(this.handleError('getIatiDataset', undefined))
      );
  }

  getNextInQueue(): Observable<IatiDataset> {
    const url: string = window.__env.apiDataworkBench + '/queue/next';

    return this.http.get<IatiDataset>(url)
      .pipe(
        tap(_ => this.log(`fetched iati dataset`)),
        catchError(this.handleError('getIatiDataset', undefined))
      );
  }

  getQueueLength(): Observable<any> {
    const url: string = window.__env.apiDataworkBench + '/queue/length';

    return this.http.get<any>(url)
      .pipe(
        tap(_ => this.log(`fetched queue length`)),
        catchError(this.handleError('getQueueLength', undefined))
      );
  }

  getIatiFile(md5: string): Observable<any> {
    const url: string = this.urlApiIatiFile + '/file/json/' + md5 + '.json';
    //   /iati-files/{container}/download/{file}
    this.log(url);
    return this.http.get<any>(url)
      .pipe(
        tap(_ => this.log(`fetched iati file`)),
        catchError(this.handleError('getIatiFile', undefined))
      );
  }

  getEmptyWorkspace(): Workspace {
    const ws: Workspace = {
      id: '',
      description: '',
      // organisation_id: '',
      // organisation_name: '',
      slug: '',
      title: '',
      'owner-slug': '',
      'iati-publisherId': '',
      versions: []
    };
    return ws;
  }

  getEmptyVersion(): Version {
    const vs: Version = {
      id: '',
      slug: '',
      ['owner-slug']: '',
      ['workspace-slug']: '',
      title: '',
      description: '',
      md5: [],
      workspaceId: ''
    };
    return vs;
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
