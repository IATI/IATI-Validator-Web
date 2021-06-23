import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';

import { Mode } from '../validate-iati';
import { LogService } from './../../core/logging/log.service';
import { FileUploadService } from './../shared/file-upload.service';
import { GoogleAnalyticsService } from '../../google-analytics.service';


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
    private readonly googleAnalyticsService: GoogleAnalyticsService,
  ) { }

  ngOnInit() {
    this.tmpWorkspaceId = this.router.parseUrl(this.router.url).queryParams.tmpWorkspaceId;
  }

  onFileChanged(event) {
    this.requestStatus = 'draft';
    this.setActiveMode.emit(Mode.local);
    this.selectedFiles = event.target.files;
    this.activeStep.push('2');
    this.googleAnalyticsService.eventEmitter('check_data_file_browse', 'Validator Check Data', 'file_uploader');
  }

  uploadFile(): void {
    const files = Array.prototype.slice.call(this.selectedFiles);
    const handleError = error => {
      // this.logger.debug('Error message component: ', error);
      this.requestStatus = 'error';
    };

    if (files.length) {
      this.googleAnalyticsService.eventEmitter('check_data_file_upload', 'Validator Check Data', 'file_uploader', files.length);
      this.requestStatus = 'pending';

      this.fileUploadService.checkWorkspaceId(this.tmpWorkspaceId)
        .subscribe(
          (response: HttpResponse<any>) => {
            const tmpWorkspaceId = response.body.id;

            this.parallelUpload(files, tmpWorkspaceId)
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

  validateFile() {
    this.googleAnalyticsService.eventEmitter('check_data_file_validate', 'Validator Check Data', 'file_uploader');
    this.router.navigate(['validate', this.tmpWorkspaceId]);
  }

  clearFiles() {
    this.googleAnalyticsService.eventEmitter('check_data_file_clear', 'Validator Check Data', 'file_uploader');
    this.clear.emit();
    this.selectedFiles = [];
    this.activeStep = ['1'];
  }

  isActiveStep(step: string): boolean {
    return this.activeStep.includes(step);
  }

  private parallelUpload(files: File[], tmpWorkspaceId: string) {
    if (!files.length) {
      return of('skip' as any);
    }

    return forkJoin(files.map(file => this.fileUploadService.uploadFile(file, tmpWorkspaceId)) as any);
  }
}
