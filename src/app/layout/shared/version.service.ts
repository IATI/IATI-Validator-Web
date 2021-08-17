import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LogService } from 'src/app/core/logging/log.service';
import { Observable, of } from 'rxjs';
import { environment } from './../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class VersionService {
  private urlApiServicesVersionVS: string = window.__env.validatorServicesUrl + '/pub/version';
  private urlApiValidatorVersionVS: string = window.__env.validatorServicesUrl + '/pub/validator-version';

  constructor(
    private http: HttpClient,
    private logger: LogService) { }

    getServicesVersion(): Observable<string> {
      const url: string = this.urlApiServicesVersionVS;
      this.log(url);
      return this.http.get(url, {responseType: 'text'})
        .pipe(
          tap(_ => this.log(`fetched validator services version`)),
          catchError(this.handleError('getServicesVersion', undefined))
        );
    }

    getValidatorVersion(): Observable<string> {
      const url: string = this.urlApiValidatorVersionVS;
      this.log(url);
      return this.http.get(url, {responseType: 'text'})
        .pipe(
          tap(_ => this.log(`fetched validator version`)),
          catchError(this.handleError('getValidatorVersion', undefined))
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
