import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/observable/of';

import { Organisation } from './organisation';
import { LogService } from '../../core/logging/log.service';

@Injectable()
export class OrganisationsService {
  private organisationsUrl = window.__env.apiDataworkBench;

  constructor(private http: HttpClient,
              private logger: LogService) { }

  getOrganisations (): Observable<Organisation[]> {
    const url: string = this.organisationsUrl + '/iati-publishers/current';
    return  this.http.get<Organisation[]>(url)
      .pipe(
        tap(_ => this.log(`fetched organisations`)),
        catchError(this.handleError('getOrganisations', []))
      );
  }

  private log(message: string) {
    if (!environment.production) {
      console.log(message);
    }
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
