import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';

import { Mode } from '../validate-iati';
import { LogService } from './../../core/logging/log.service';
import { FileUploadService } from './../shared/file-upload.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  @Output() setActiveMode = new EventEmitter<Mode>();
  @Output() clear = new EventEmitter<void>();

  @Input() mode: Mode;

  selectedFiles: File[] = [];
  workspaceId = '';
  tmpWorkspaceId = '';
  fileUploaded = false;
  requestStatus: 'pending' | 'draft' | 'success' | 'error' = 'draft';
  fetchUrl = '';

  activeStep = ['1'];

  constructor(
    private readonly logger: LogService,
    private readonly router: Router,
    private readonly fileUploadService: FileUploadService,
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

  onFileChanged(event) {
    this.requestStatus = 'draft';
    this.setActiveMode.emit(Mode.local);
    this.selectedFiles = event.target.files;
    this.activeStep.push('2');
  }

  uploadFile(): void {
    const files = Array.prototype.slice.call(this.selectedFiles);
    const handleError = error => {
      this.requestStatus = 'error';
    };

    if (files.length) {
      this.requestStatus = 'pending';

      this.parallelUpload(files)
      .subscribe(
        () => {
          this.activeStep = ['3'];
          this.requestStatus = 'success';
        },
        handleError
      );
    }
  }

  validateFile() {
    this.router.navigate(['validate', this.tmpWorkspaceId]);
  }

  clearFiles() {
    this.clear.emit();
    this.selectedFiles = [];
    this.activeStep = ['1'];
  }

  isActiveStep(step: string): boolean {
    return this.activeStep.includes(step);
  }

  private parallelUpload(files: File[]) {
    if (!files.length) {
      return of('skip' as any);
    }

    return forkJoin(files.map(file => this.fileUploadService.uploadFile(file, this.tmpWorkspaceId)) as any);
  }
}
