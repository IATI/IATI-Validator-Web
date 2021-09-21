import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';

import { LogService } from '../../core/logging/log.service';
import { IatiTestDataset } from './../shared/iati-testdataset';
import { ValidatedIatiService } from './../shared/validated-iati.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-validate-result',
  templateUrl: './validate-result.component.html',
  styleUrls: ['./validate-result.component.scss']
})
export class ValidateResultComponent implements OnDestroy {
  workspaceId = '';
  uploadId = '';
  currentUrl = '';
  iatiDatasetDatas: IatiTestDataset[] = [];
  md5 = '';
  environmentUrl = window.__env.baseUrl;
  source = timer(100, 2500);
  subscribeTimer: Subscription;
  interval: any;
  emailMode: 'saved' | 'edit' | 'draft' = 'draft';

  newEmail = this.fb.control('', [Validators.required, Validators.email]);
  newForm: FormGroup = this.fb.group({
    email: this.newEmail,
  });

  email = this.fb.control('', [Validators.required, Validators.email]);
  form: FormGroup = this.fb.group({
    email: this.email,
  });

  constructor(
    private readonly activateRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly validatedIatiService: ValidatedIatiService,
    private readonly logger: LogService,
    private readonly fb: FormBuilder,
    private cookieService: CookieService
  ) {

    this.activateRoute
      .params
      .subscribe(params => {
        this.uploadId = params['id'];
      });

    this.subscribeTimer = this.source.subscribe(val => {
      this.loadData();

      if (this.reportsComplete()) {
        logger.debug('unsubscribe');
        this.subscribeTimer.unsubscribe();
      }
    });
  }

  ngOnDestroy() {
    this.subscribeTimer.unsubscribe();
  }

  loadData() {
    this.validatedIatiService.getTmpWorkspace(this.uploadId)
      .subscribe(
        data => {
          if (!this.email.value && data.email) {
            this.email.setValue(data.email);
            this.emailMode = 'saved';
          }
          for (const element of data) {
            element.class = this.fileStatus(element);
          }

          this.iatiDatasetDatas = data;
        },
        error => this.logger.error('Faild to load iati data', error)
      );
  }

  reportsComplete(): boolean {
    if (this.iatiDatasetDatas.length === 0) {
      return false;
    }

    for (const idd of this.iatiDatasetDatas) {
      if (idd.report === null) {
        return false;
      }
    }

    return true;
  }

  jsonUpdated(inDataset: IatiTestDataset): boolean {
    return !!inDataset['json-updated'];
  }

  reportType(dataset): string {
    return this.jsonUpdated(dataset) ? 'Validation finished (click to view)' : '-';
  }

  rowClick(dataset: IatiTestDataset) {
    if (dataset.valid != null) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          isTestfiles: true,
        }
      };

      this.router.navigate(['view', 'dqf', 'files', dataset.guid], navigationExtras);
    }
  }

  fileStatus(dataset): string {
    let error = -1;
    let warning = -1;
    let valid = null;

    if (dataset.report !== null) {
      ({ valid } = dataset.report);
      error = dataset.report.summary.error;
      warning = dataset.report.summary.warning;
    }

    if (dataset.report === null) {
      return 'normal';
    } else if (valid === true && error === 0 && warning === 0) {
      return 'success dqf';
    } else if (valid === true && error === 0) {
      return 'warning dqf';
    } else if (valid === true) {
      return 'error dqf';
    } else if (valid === false) {
      return 'critical dqf';
    } else {
      return 'normal';
    }
  }

  copyTextToClipboard(_) {
    const txtArea = document.createElement('textarea');
    const url = this.environmentUrl + '/validate/' + this.uploadId;
    txtArea.id = 'txt';
    txtArea.style.position = 'fixed';
    txtArea.style.top = '0';
    txtArea.style.left = '0';
    txtArea.style.opacity = '0';
    txtArea.value = url;
    document.body.appendChild(txtArea);
    txtArea.select();

    try {
      const successful = document.execCommand('copy');
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

  saveEmailAddress() {
    // TODO: added api call
    if (this.form.valid) {
      this.emailMode = 'saved';
      this.validatedIatiService.sendEmail(this.uploadId, this.email.value).subscribe();
    }
  }

  editEmail() {
    this.newEmail.setValue(this.email.value);
    this.emailMode = 'edit';
  }

  updateEmail() {
    // TODO: added api call
    if (this.newForm.valid) {
      this.email.setValue(this.newEmail.value);
      this.validatedIatiService.sendEmail(this.uploadId, this.newEmail.value).subscribe();
      this.newEmail.reset();
      this.emailMode = 'saved';
    }
  }

  returnViewMode() {
    this.newEmail.reset();
    this.emailMode = 'saved';
  }

  addMoreFiles() {
    this.router.navigate(['/validate'], {
      queryParams: {
        tmpWorkspaceId: this.uploadId,
      }
    });
  }

  async clearWorkspace() {
    if( ! confirm('Are you sure you want to clear all files from your workspace and return to the upload page?')) {
      return;
    }

    await this.cookieService.delete('adhocsession', '/');
    this.router.navigate(['/validate']);
  }

  removeEmail() {
    this.validatedIatiService.sendEmail(this.uploadId, null).subscribe(
      () => {
        this.newEmail.reset();
        this.email.reset();
        this.emailMode = 'draft';
      }
    );
  }
}
