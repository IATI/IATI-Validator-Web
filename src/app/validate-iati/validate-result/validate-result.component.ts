import { IatiTestdataset } from './../shared/iati-testdataset';
import { ActivatedRoute, UrlSegment, Router, NavigationExtras } from '@angular/router';
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
  environmentUrl = environment.baseUrl;
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
    if (inDataset['json-updated']) {
      return true;
    } else {
      return false;
    }
  }

  reportType(dataset): string {
    if (this.jsonUpdated(dataset)) {
      // Routerlink naar de view pagina
      return 'Validation finished (click to view)';
    } else {
      return '-';
    }
  }

  rowClick(dataset: IatiTestdataset) {


    if (this.jsonUpdated(dataset)) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'isTestfiles': true,
        }
      };


      // Routerlink naar de view pagina
      this.router.navigate(['view', 'dqf', 'files',this.uploadId], navigationExtras);
    } else {
      // this.selectedMd5.emit(this.md5);
    }
  }

  ngOnDestroy() {
    this.subscribeTimer.unsubscribe();
  }


   copyTextToClipboard(text) {
    const txtArea = document.createElement("textarea");
    const url = this.environmentUrl+'/validate/'+this.uploadId;
    txtArea.id = 'txt';
    txtArea.style.position = 'fixed';
    txtArea.style.top = '0';
    txtArea.style.left = '0';
    txtArea.style.opacity = '0';
    txtArea.value = url;
    document.body.appendChild(txtArea);
    txtArea.select();
  
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + url);
      if (successful) {
        return true;
      }
    } catch (err) {
      console.log('Oops, unable to copy');
    } finally {
      document.body.removeChild(txtArea);
    }
    return false;
  }

}
