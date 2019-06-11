import { IatiTestdataset } from './../shared/iati-testdataset';
import { ActivatedRoute, UrlSegment, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { ValidatedIatiService } from './../shared/validated-iati.service';
import { LogService } from '../../core/logging/log.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { timer } from 'rxjs/observable/timer';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-validate-result',
  templateUrl: './validate-result.component.html',
  styleUrls: ['./validate-result.component.scss']
})
export class ValidateResultComponent implements OnInit, OnDestroy {
  workspaceId = '';
  uploadId = '';
  currentUrl = '';
  iatiDatasetData: IatiTestdataset;
  md5 = '';
  environmentUrl = environment.apiDataworkBench;
  source = timer(100, 2000);
  subscribeTimer: Subscription;
  interval: any;

  constructor(private activateRoute: ActivatedRoute,
    private router: Router,
    private validatedIatiService: ValidatedIatiService,
    private logger: LogService) {

    this.activateRoute
      .params
      .subscribe(params => {
      //  this.workspaceId = params['id'];
        this.uploadId = params['id'];
      });

    this.subscribeTimer = this.source.subscribe(val => {
      this.loadData();
      if (this.allDataHasJsonUpdated()) {
        logger.debug('unsubscribe');
        this.subscribeTimer.unsubscribe();
      }
    });
  }

  ngOnInit() {
    // this.loadData();
  }

  loadData() {
    // this.validatedIatiService.getIatiDataset(this.workspaceId)
    //   .subscribe(
    //     data => {
    //     this.iatiDatasetData = data;
    //       console.log(data);
    //     },
    //     error => this.logger.error('Faild to load iati data', error),
    //     () => {
    //       // Completed

    //     }
    //   );
    this.validatedIatiService.getIatiDatasetById(this.uploadId)
      .subscribe(
        data => {
        this.iatiDatasetData = data;
        },
        error => this.logger.error('Faild to load iati data', error),
        () => {
          // Completed

        }
      );
  }

  allDataHasJsonUpdated(): boolean {

    if (!this.iatiDatasetData) {
      return false;
    } 
    // else if (this.iatiDatasetData.length === 0) {
    //   return false;
    // } 
    else {
      // return this.iatiDatasetData.every(x => this.jsonUpdated(x));
      return this.jsonUpdated(this.iatiDatasetData);
    }

  }

  jsonUpdated(inDataset:IatiTestdataset): boolean {
    if (this.iatiDatasetData['json-updated']) {
      return true;
    } else {
      return false;
    }
  }

  reportType(dataset): string {
    if (this.jsonUpdated(dataset)) {
      // Routerlink naar de view pagina
      return 'Data Quality Report (click to view)';
    } else {
      return '-';
    }
  }

  rowClick(dataset: IatiTestdataset) {

    if (this.jsonUpdated(dataset)) {
      // Routerlink naar de view pagina
      this.router.navigate(['view', 'dqf', dataset.md5]);
    } else {
      // this.selectedMd5.emit(this.md5);
    }
  }

  ngOnDestroy() {
    this.subscribeTimer.unsubscribe();
  }

}
