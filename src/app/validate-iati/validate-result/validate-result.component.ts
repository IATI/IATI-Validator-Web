import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';

import { LogService } from '../../core/logging/log.service';
import { IatiTestDataset } from './../shared/iati-testdataset';
import { ValidatedIatiService } from './../shared/validated-iati.service';


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
  source = timer(100, 2000);
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
    private readonly fb: FormBuilder
  ) {

    this.activateRoute
      .params
      .subscribe(params => {
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
          // this;
          this.iatiDatasetDatas = data.datasets;
        },
        error => this.logger.error('Faild to load iati data', error)
      );
  }

  allDataHasJsonUpdated(): boolean {
    if (!this.iatiDatasetDatas.length) {
      return false;
    } else {
      return this.iatiDatasetDatas.every(iatiDatasetData => this.jsonUpdated(iatiDatasetData));
    }
  }

  jsonUpdated(inDataset: IatiTestDataset): boolean {
    return !!inDataset['json-updated'];
  }

  hasSourceUrl(inDataset: IatiTestDataset): boolean {
    return !!inDataset.sourceUrl;
  }

  reportType(dataset): string {
    return this.jsonUpdated(dataset) ? 'Validation finished (click to view)' : '-';
  }

  rowClick(dataset: IatiTestDataset, id: string) {
    if (this.jsonUpdated(dataset)) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          isTestfiles: true,
        }
      };

      this.router.navigate(['view', 'dqf', 'files', id], navigationExtras);
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
