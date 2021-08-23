import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { LogService } from '../../core/logging/log.service';


@Injectable()
export class ValidatedIatiService {
  private apiKeyName: string = window.__env.validatorServicesKeyName;
  private apiKeyValue: string = window.__env.validatorServicesKeyValue;
  private authHeader: HttpHeaders = new HttpHeaders({ [this.apiKeyName]: this.apiKeyValue });

  constructor(
    private logger: LogService,
    private http: HttpClient
  ) { }

  // TODO: replace any
  getTmpWorkspace(workspaceId: string): any {
    const url: string = this.urlApiTmpWorkspace(workspaceId);

    return this.http.get(url, {headers: this.authHeader}).pipe(
      catchError(this.handleError('getTmpWorkspace', undefined))
    );

  }

  sendEmail(id: string, email: string) {
    return this.http.patch(this.urlApiTmpWorkspace(id), {
      email
    }, {headers: this.authHeader}).pipe(
      catchError(this.handleError('sendEmail', undefined))
    );
  }

  private urlApiTmpWorkspace = (id: string) => `${window.__env.validatorServicesUrl}/pvt/adhoc/session/?sessionId=${id}`;

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
