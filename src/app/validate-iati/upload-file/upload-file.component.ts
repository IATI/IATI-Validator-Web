import { Subscription } from 'rxjs/Subscription';
import { FileUploadService } from './../shared/file-upload.service';
import { Router, NavigationExtras } from '@angular/router';
import { LogService } from './../../core/logging/log.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpResponse, HttpEventType } from '@angular/common/http';
import { UploadResponse } from './../shared/uploadResponse';
import { MessagesService } from './../shared/messages.service';
import { Message } from '../shared/message';
import { MessageType } from '../shared/message-type.enum';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit, OnDestroy {
  selectedFile: File;
  workspaceId = '';
  fileUploaded = false;
  uploading = false;
  fetchUrl = '';
  uploadId = '';
  message: Message;
  messages: Message[] = [];
  messagesSub: Subscription;

  private urlApiFileUpUpload: string = window.__env.apiDataworkBench + '/iati-testdatasets/upload';
  constructor(private http: HttpClient,
    private logger: LogService,
    private router: Router,
    private fileUploadService: FileUploadService,
    public messageService: MessagesService) { }

  ngOnInit() {

    this.messagesSub = this.messageService.messages
      .subscribe(
        (messages: Message[]) => {
          this.messages = messages;
          this.message = messages[messages.length - 1];
        }
      );

  }

  onFileChanged(event) {
    this.uploading = false;
    this.selectedFile = event.target.files[0];
  }

  onFetch() {
    let blob = null;
    let request = new XMLHttpRequest();
    request.open('GET', this.fetchUrl);
    request.responseType = 'blob';
    request.onload = function () {
      var reader = new FileReader();
      reader.readAsDataURL(request.response);
      reader.onload = function (e) {
        console.log('DataURL:', e.target);
      };
    };
    request.send();
  }

  UploadFile() {
  //  this.workspaceId = Math.random().toString(36).substring(2);

    if (this.selectedFile) {
      this.uploading = true;
      this.fileUploadService.uploadFile(this.selectedFile).subscribe( 
        msg => {
          this.uploading = false;
          if (msg.type === MessageType.done) {
            this.fileUploaded = true;
            // this.ValidateFile();
            this.uploadId = msg.uploadId;
          }
        },
        error => {
          this.logger.debug('Error message component: ', error);
          this.uploading = false;
        }
      );
    }
  }

  ValidateFile() {
    // this.router.navigate(['validate', this.workspaceId]);
    

    this.router.navigate(['validate', this.uploadId]);
  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();
  }

}
