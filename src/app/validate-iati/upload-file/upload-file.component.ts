import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Router } from '@angular/router';

import { FileUploadService } from './../shared/file-upload.service';
import { LogService } from './../../core/logging/log.service';
import { MessagesService } from './../shared/messages.service';
import { Message } from '../shared/message';
import { Mode } from '../validate-iati';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit, OnDestroy {
  @Output() setActiveMode = new EventEmitter<Mode>();
  @Output() clear = new EventEmitter<void>();

  @Input() mode: Mode;

  selectedFiles: File[] = [];
  workspaceId = '';
  tmpWorkspaceId = '';
  fileUploaded = false;
  uploading = false;
  fetchUrl = '';
  message: Message;
  messages: Message[] = [];
  messagesSub: Subscription;

  activeStep = ['1'];

  constructor(
    private readonly logger: LogService,
    private readonly router: Router,
    private readonly fileUploadService: FileUploadService,
    public readonly messageService: MessagesService
  ) { }

  ngOnInit() {
    this.tmpWorkspaceId = this.router.parseUrl(this.router.url).queryParams.tmpWorkspaceId;

    this.messagesSub = this.messageService.messages
      .subscribe(
        (messages: Message[]) => {
          // console.log('messages: ', messages);
          this.messages = messages;
          this.message = messages[messages.length - 1];
        }
      );
  }

  onFileChanged(event) {
    this.uploading = false;
    this.setActiveMode.emit(Mode.local);
    this.selectedFiles = event.target.files;
    this.activeStep.push('2');
  }

  onFetch() {
    const request = new XMLHttpRequest();
    request.open('GET', this.fetchUrl);
    request.responseType = 'blob';
    request.onload = function () {
      const reader = new FileReader();
      reader.readAsDataURL(request.response);
      reader.onload = function (e) {
        console.log('DataURL:', e.target);
      };
    };
    request.send();
  }

  UploadFile() {
    const files = Array.prototype.slice.call(this.selectedFiles);
    console.log(files);
    const handleError = error => {
      this.logger.debug('Error message component: ', error);
      this.uploading = false;
    };

    if (this.selectedFiles.length) {
      this.uploading = true;
      if (!this.tmpWorkspaceId) {
        const [firstFile] = files;
        const otherFiles = files.slice(1);

        this.fileUploadService.uploadFile(firstFile)
          .subscribe(
            (response: HttpResponse<any>) => {
              const { tmpworkspaceId } = response.body;
              this.uploading = false;

              this.parallelUpload(otherFiles, tmpworkspaceId)
                .subscribe(
                  () => {
                    this.tmpWorkspaceId = tmpworkspaceId;
                    this.activeStep = ['3'];
                    this.uploading = false;
                  },
                  handleError
                );
          },
          handleError
        );
      } else {
        this.parallelUpload(files, this.tmpWorkspaceId)
          .subscribe(
            () => {
              this.activeStep = ['3'];
              this.uploading = false;
            },
            handleError
          );
      }
    }
  }

  ValidateFile() {
    this.router.navigate(['validate', this.tmpWorkspaceId]);
  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();
  }


  clearFiles() {
    this.clear.emit();
    this.selectedFiles = [];
  }

  isActiveStep(step: string): boolean {
    return this.activeStep.includes(step);
  }

  private parallelUpload(files: File[], tmpworkspaceId: string) {
    return forkJoin(files.map(file => this.fileUploadService.uploadFile(file, tmpworkspaceId)) as any);
  }
}
