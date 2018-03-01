import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/observable/of';

import { environment } from './../../../environments/environment';
import { Organisation } from './organisation';
import { Workspace } from './workspace';


@Injectable()
export class OrganisationService {
  private urlApiOrganisation: string = environment.apiBaseUrl + '/organisations';
  private urlApiWorkspaces: string = environment.apiBaseUrl + '/workspaces';

  constructor(private http: HttpClient) { }

  getOrganisation(name: string): Observable<Organisation> {
    const url: string = this.urlApiOrganisation + '/' + name;
    this.log(url);
    return this.http.get<Organisation>(url).pipe(
      tap(_ => this.log(`fetched organisation id=${name}`)),
      catchError(this.handleError<Organisation>(`getOrganisation id=${name}`))
    );
  }

getWorkspaces(name: string): Observable<Array<Workspace>> {
  const url: string = this.urlApiWorkspaces + '?organisation=' + name;
  this.log(url);
  return this.http.get<Workspace[]>(url)
  .pipe(
    tap(_ => this.log(`fetched workspaces`)),
    catchError(this.handleError('getWorkspaces', []))
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
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


}
