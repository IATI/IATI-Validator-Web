import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';

import { IatiTestdataset } from './iati-testdataset';
import { LogService } from '../../core/logging/log.service';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Injectable()
export class ValidatedIatiService {
  private urlApiIatiDataset: string = window.__env.apiDataworkBench + '/iati-testdatasets';

  constructor(private logger: LogService,
              private http: HttpClient) { }

  getIatiDataset(workspaceId: string): Observable<IatiTestdataset[]> {
    const url: string = this.urlApiIatiDataset + '/?filter[where][tmpworkspaceId]=' + workspaceId;

    this.logger.debug(url);
    return this.http.get<IatiTestdataset>(url)
    .pipe(
      tap(_ => this.logger.debug(`fetched iati dataset`)),
      catchError(this.handleError('getIatiDataset', undefined ))
    );
  }

  getIatiDatasetById(inUploadId): Observable<IatiTestdataset> {
    const url: string = this.urlApiIatiDataset +'/'+inUploadId;
    return this.http.get<any>(url).pipe(
      tap(_ => this.logger.debug(`fetched iati dataset`)),
      catchError(this.handleError('getIatiDataset', undefined))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
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
