import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/observable/of';

import { environment } from './../../../../environments/environment';
import { LogService } from '../../../core/logging/log.service';
import { Severity } from './severity';


@Injectable()
export class DataQualityFeedbackService {
  private urlApiOrganisation: string = environment.apiDataworkBench + '/iati-publishers';



  constructor(private http: HttpClient,
    private logger: LogService) { }


  getSeverities(): Severity[] {
    return [
      { id:  'error', slug: 'error' , name: 'Errors', count: 123, order: 1, show: true},
      { id:  'warning', slug: 'warning' , name: 'Warnings', count: 34,  order: 2, show: true},
      { id:  'improvement', slug: 'improvement' , name: 'Improvements', count: 55, order: 3,  show: true},
      { id:  'optimisation', slug: 'optimisation' , name: 'Optimisations', count: 3, order: 4, show: true},
    ];
  }

}
