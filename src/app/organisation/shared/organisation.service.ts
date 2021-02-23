import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { LogService } from './../../core/logging/log.service';
import { IatiDataset } from './iati-dataset';
import { Organisation } from './organisation';
import { Version } from './version';
import { Workspace } from './workspace';

@Injectable()
export class OrganisationService {
  private urlApiOrganisation: string = window.__env.apiDataworkBench + '/iati-publishers';
  private urlApiWorkspaces: string = window.__env.apiDataworkBench + '/workspaces';
  private urlApiVersions: string = window.__env.apiDataworkBench + '/versions';
  private urlApiIatiDataset: string = window.__env.apiDataworkBench + '/iati-datasets';
  private urlApiIatiFile: string = window.__env.apiDataworkBench + '/iati-files';

  constructor(
    private http: HttpClient,
    private logger: LogService
  ) { }
  // ttp://dev1.dataworkbench.io/api/iati-publishers/findOne?filter[where][slug]=cordaid
  getOrganisation(name: string): Observable<Organisation> {
    const url: string = this.urlApiOrganisation + '/findOne?filter[where][slug]=' + name + '&filter[include]=workspaces';
    this.log(url);
    return this.http.get<Organisation>(url).pipe(
      tap(_ => this.log(`fetched organisation id=${name}`)),
      catchError(this.handleError<Organisation>(`getOrganisation id=${name}`))
    );
  }

  getWorkspaces(organisation: string): Observable<Workspace[]> {
    const url: string = this.urlApiWorkspaces + '?organisation_id=' + organisation;
    this.log(url);
    return this.http.get<Workspace[]>(url)
      .pipe(
        tap(_ => this.log(`fetched workspaces`)),
        catchError(this.handleError('getWorkspaces', []))
      );
  }

  getWorkspace(organisationSlug: string, workspaceSlug: string): Observable<Workspace> {
    const url: string = this.urlApiWorkspaces + '/findOne?filter=' +
      `{"where":{"and": [ {"owner-slug": "${organisationSlug}"}, {"slug": "${workspaceSlug}"}]}, "include": "versions"}`;
    this.log(url);
    return this.http.get<Workspace>(url)
      .pipe(
        tap(_ => this.log(`fetched workspaces`)),
        catchError(this.handleError('getWorkspaces', undefined))
      );
  }

  getVersions(workspaceid: string): Observable<Version[]> {
    const url: string = this.urlApiVersions + '?workspace_id=' + workspaceid;
    this.log(url);
    return this.http.get<Version[]>(url)
      .pipe(
        tap(_ => this.log(`fetched versions`)),
        catchError(this.handleError('getVersions', []))
      );
  }

  getVersion(workspaceId: string, versionSlug: string): Observable<Version[]> {
    const url: string = this.urlApiWorkspaces + '/' + workspaceId + '/versions?filter[where][slug]=' + versionSlug;

    this.log(url);
    return this.http.get<Version>(url)
      .pipe(
        tap(_ => this.log(`fetched version`)),
        catchError(this.handleError('getVersion', undefined))
      );
  }

  getFileDataForPublisher(publisher: string): Observable<Version[]> {
    const url: string = this.urlApiIatiDataset + '/?filter[where][publisher]=' + publisher;

    this.log(url);
    return this.http.get<Version>(url)
      .pipe(
        tap(_ => this.log(`fetched version`)),
        catchError(this.handleError('getVersion', undefined))
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
