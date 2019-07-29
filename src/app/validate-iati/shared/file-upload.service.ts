import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import {
  HttpClient, HttpEvent, HttpEventType, HttpProgressEvent,
  HttpRequest, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { catchError, last, map, tap, retry } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { environment } from './../../../environments/environment';
import { LogService } from './../../core/logging/log.service';
import { MessageType } from './message-type.enum';
import { Message } from './message';
import { MessagesService } from './messages.service';

@Injectable()
export class FileUploadService {
  private urlApiFileUpUpload: string = window.__env.apiDataworkBench + '/iati-testdatasets/upload';

  constructor(private http: HttpClient,
              private logger: LogService,
              private messagesService: MessagesService) { }


  uploadFile(file: File) {
    if (!file) { return; }
 

    this.messagesService.clear();

    // workspaceid moet je meegeven via de options in de REST URL
    const url = this.urlApiFileUpUpload;
    const uploadData = new FormData();
    uploadData.append('file', file, file.name);

    // Create the request object that POSTs the file to an upload endpoint.
    // The `reportProgress` option tells HttpClient to listen and return
    // XHR progress events.
    const req = new HttpRequest('POST', url, uploadData, {
      reportProgress: true
    });

    // The `HttpClient.request` API produces a raw event stream
    // which includes start (sent), progress, and response events.
    return this.http.request(req).pipe(
      map(event => this.getEventMessage(event, file)),
      tap(message => this.addProgressMessages(message.type, message.message, message.progress)),
      last(), // return last (completed) message to caller
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError(file))
    );

  }

  /** Return distinct message for sent, upload progress, & response events */
  private getEventMessage(event: HttpEvent<any>, file: File): Message {
    switch (event.type) {
      case HttpEventType.Sent:
      const mes: Message = { message: `Uploading file "${file.name}" of size ${file.size}.`, type: MessageType.progress, progress: 0 } ;
      return  mes ;

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        let percentDone = Math.round(100 * event.loaded / event.total);
        if (isNaN(percentDone)) { percentDone = 0 ; }
        // tslint:disable-next-line:max-line-length
        const mes2: Message = { message: `File "${file.name}" is ${percentDone}% uploaded.`, type: MessageType.progress, progress: percentDone } ;
        return mes2;

      case HttpEventType.Response:
        const mes3: Message = { message: `File "${file.name}" was completely uploaded!`, type: MessageType.done, progress: 100, uploadId: event.body.id } ;
        return mes3;

      default:
      // tslint:disable-next-line:max-line-length
      const mes4: Message = { message: `File "${file.name}" upload event: ${event.type}.`, type: MessageType.done, progress: 0} ;
        return mes4;
    }
  }

  /**
   * Returns a function that handles Http upload failures.
   * @param file - File object for file being uploaded
   *
   * When no `UploadInterceptor` and no server,
   * you'll end up here in the error handler.
   */
  private handleError(file: File) {
    const userMessage = `${file.name} upload failed.`;

    return (error: HttpErrorResponse) => {
      // TODO: send the error to remote logging infrastructure
      this.logger.error('Error file-upload service', error); // log to console instead

      const errorMessage = (error.error instanceof Error) ?
                      error.error.message :
                      `server returned code ${error.status} with body "${error.error}"`;

      const message: Message = {type: MessageType.error, message: userMessage, progress: -1 };

      this.addProgressMessages(message.type, message.message, message.progress) ;

      // Let app keep running but indicate failure.
      return of(message);
    };
  }

  private addProgressMessages(type: MessageType, message: string, progress: number) {
    const mes: Message = { message: message, type: type, progress: progress } ;
    this.messagesService.add(mes);
  }


}
