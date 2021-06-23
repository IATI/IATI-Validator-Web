import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';

import { Mode } from '../validate-iati';
import { FileUploadService } from './../shared/file-upload.service';
import { GoogleAnalyticsService } from '../../google-analytics.service';


@Component({
  selector: 'app-upload-urls',
  templateUrl: './upload-urls.component.html',
  styleUrls: ['./upload-urls.component.scss']
})
export class UploadUrlsComponent implements OnInit {
  @Output() setActiveMode = new EventEmitter<Mode>();
  @Output() clear = new EventEmitter<void>();

  @Input() mode: Mode;

  urls = '';
  incorrectUrls = '';
  fileName = '';
  tmpWorkspaceId = '';

  activeStep: string[] = ['1'];
  requestStatus: 'pending' | 'draft' | 'success' | 'error' = 'draft';

  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly router: Router,
    private readonly googleAnalyticsService: GoogleAnalyticsService,
  ) { }

  ngOnInit() {
    this.tmpWorkspaceId = this.router.parseUrl(this.router.url).queryParams.tmpWorkspaceId;
  }

  setUrl($event): void {
    if ($event.target.value.length) {
      this.setActiveMode.emit(Mode.urls);
      this.activeStep.push('2');
    } else {
      this.incorrectUrls = '';
      this.clear.emit();
      this.activeStep = ['1'];
    }

    this.urls = $event.target.value;
    this.googleAnalyticsService.eventEmitter('check_data_url_setUrl', 'Validator Check Data', 'url_uploader');
  }

  fetchFiles() {
    const serializedUrls = this.urls.split('|').map(url => url.trim());
    const correctUrls = serializedUrls.filter(this.validateUrl);
    this.incorrectUrls = serializedUrls.filter(url => !this.validateUrl(url)).join(' | ');

    if (correctUrls.length && !this.incorrectUrls.length) {
      this.googleAnalyticsService.eventEmitter('check_data_url_fetchFiles', 'Validator Check Data', 'url_uploader', correctUrls.length);
      const urls = correctUrls.slice();
      const handleError = error => {
        console.log('error: ', error);
        this.requestStatus = 'error';
      };

      this.requestStatus = 'pending';

      this.fileUploadService.checkWorkspaceId(this.tmpWorkspaceId)
        .subscribe(
          (response: any) => {
            const tmpWorkspaceId = response.body.id;

            (this.parallelUpload(urls, tmpWorkspaceId) as any)
              .subscribe(
                () => {
                  this.tmpWorkspaceId = tmpWorkspaceId;
                  this.activeStep = ['3'];
                  this.requestStatus = 'success';
                },
                handleError
              );
          },
          handleError
        );
    }
  }

  isActiveStep(step: string): boolean {
    return this.activeStep.includes(step);
  }

  validateFile() {
    this.googleAnalyticsService.eventEmitter('check_data_url_validate', 'Validator Check Data', 'url_uploader');
    this.router.navigate(['validate', this.tmpWorkspaceId]);
  }

  private validateUrl(value) {
    // eslint-disable-next-line
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
  }

  private parallelUpload(urls: string[], tmpWorkspaceId: string) {
    if (!urls.length) {
      return of('skip' as any);
    }

    return forkJoin(urls.map(url => this.fileUploadService.fetchFileByUrl(url, tmpWorkspaceId)) as any);
  }
}
