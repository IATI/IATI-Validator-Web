import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';

import { Mode } from '../validate-iati';
import { FileUploadService } from './../shared/file-upload.service';
import { CookieService } from 'ngx-cookie-service';


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
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    if (this.cookieService.check('adhocsession')) {
      this.tmpWorkspaceId = this.cookieService.get('adhocsession');
    } else {
      this.tmpWorkspaceId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      this.cookieService.set('adhocsession', this.tmpWorkspaceId);
    }
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
  }

  fetchFiles() {
    const serializedUrls = this.urls.split('|').map(url => url.trim());
    const correctUrls = serializedUrls.filter(this.validateUrl);
    this.incorrectUrls = serializedUrls.filter(url => !this.validateUrl(url)).join(' | ');

    if (correctUrls.length && !this.incorrectUrls.length) {
      const urls = correctUrls.slice();
      const handleError = error => {
        console.log('error: ', error);
        this.requestStatus = 'error';
      };

      this.requestStatus = 'pending';

      (this.parallelUpload(urls) as any)
      .subscribe(
        () => {
          this.activeStep = ['3'];
          this.requestStatus = 'success';
        },
        handleError
      );
    }
  }

  isActiveStep(step: string): boolean {
    return this.activeStep.includes(step);
  }

  validateFile() {
    this.router.navigate(['validate', this.tmpWorkspaceId]);
  }

  private validateUrl(value) {
    // eslint-disable-next-line
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
  }

  private parallelUpload(urls: string[]) {
    if (!urls.length) {
      return of('skip' as any);
    }

    return forkJoin(urls.map(url => this.fileUploadService.fetchFileByUrl(url, this.tmpWorkspaceId)) as any);
  }
}
