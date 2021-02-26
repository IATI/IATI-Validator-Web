import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { LogService } from '../../core/logging/log.service';
import { IatiTestDataset } from './iati-testdataset';


@Injectable()
export class ValidatedIatiService {
  private urlApiIatiDataset: string = window.__env.apiDataworkBench + '/iati-testdatasets';

  constructor(
    private logger: LogService,
    private http: HttpClient
  ) { }

  getIatiDataset(workspaceId: string): Observable<IatiTestDataset[]> {
    const url: string = this.urlApiIatiDataset + '/?filter[where][tmpworkspaceId]=' + workspaceId;

    this.logger.debug(url);

    return this.http.get<IatiTestDataset>(url)
      .pipe(
        tap(_ => this.logger.debug(`fetched iati dataset`)),
        catchError(this.handleError('getIatiDataset', undefined))
      ) as any;
  }

  getIatiDatasetById(inUploadId: string): Observable<IatiTestDataset> {
    const url: string = this.urlApiIatiDataset + '/' + inUploadId;
    return this.http.get<any>(url)
      .pipe(
        tap(_ => this.logger.debug(`fetched iati dataset`)),
        catchError(this.handleError('getIatiDataset', undefined))
      ) as any;
  }

  // TODO: replace any
  getTmpWorkspace(workspaceId: string): any {
    const url: string = this.urlApiTmpWorkspace(workspaceId);

    return this.http.get(url).pipe(
      catchError(this.handleError('getTmpWorkspace', undefined))
    );

  }

  sendEmail(id: string, email: string) {
    return this.http.patch(this.urlApiTmpWorkspace(id), {
      email
    }).pipe(
      catchError(this.handleError('sendEmail', undefined))
    );
  }


  private urlApiTmpWorkspace = (id: string) => `${window.__env.apiDataworkBench}/iati-testworkspaces/${id}`;

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

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
