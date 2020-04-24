import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { Router } from '@angular/router';

import { FileUploadService } from './../shared/file-upload.service';
import { LogService } from './../../core/logging/log.service';
import { Mode } from '../validate-iati';

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
  ) { }

  ngOnInit() {
    this.tmpWorkspaceId = this.router.parseUrl(this.router.url).queryParams.tmpWorkspaceId;
  }

  onFileChanged(event) {
    this.requestStatus = 'draft';
    this.setActiveMode.emit(Mode.local);
    this.selectedFiles = event.target.files;
    this.activeStep.push('2');
  }

  UploadFile(): void {
    const files = Array.prototype.slice.call(this.selectedFiles);
    const handleError = error => {
      console.log('error: ', error);
      // this.logger.debug('Error message component: ', error);
      this.requestStatus = 'error';
    };

    if (files.length)  {
      this.requestStatus = 'pending';

      this.fileUploadService.checkWorkspaceId(this.tmpWorkspaceId)
        .subscribe(
          (response: HttpResponse<any>) => {
            const tmpWorkspaceId = response.body.id;

            console.log('using workspace', tmpWorkspaceId);

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

  ValidateFile() {
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

  private parallelUpload(files: File[], tmpWorkspaceId: string) {
    if (!files.length) {
      return of('skip' as any);
    }

    return forkJoin(files.map(file => this.fileUploadService.uploadFile(file, tmpWorkspaceId)) as any);
  }
}
