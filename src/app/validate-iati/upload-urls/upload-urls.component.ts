import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';

import { FileUploadService } from './../shared/file-upload.service';
import { Mode } from '../validate-iati';

@Component({
  selector: 'app-upload-urls',
  templateUrl: './upload-urls.component.html',
  styleUrls: ['./upload-urls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadUrlsComponent implements OnInit {
  @Output() setActiveMode = new EventEmitter<Mode>();
  @Output() clear = new EventEmitter<void>();

  @Input() mode: Mode;

  urls = '';
  incorrectUrls = '';
  fileName = '';

  constructor(private readonly fileUploadService: FileUploadService) { }

  ngOnInit() {
  }

  setUrl($event): void {
    if ($event.target.value.length) {
      this.setActiveMode.emit(Mode.urls);
    } else {
      this.incorrectUrls = '';
      this.clear.emit();
    }

    this.urls = $event.target.value;
  }

  fetchFiles() {
    const serializedUrls = this.urls.split(',').map(url => url.trim());
    const correctUrls = serializedUrls.filter(this.validateUrl);
    this.incorrectUrls = serializedUrls.filter(url => !this.validateUrl(url)).join(', ');

    if (correctUrls.length) {
      this.fileUploadService.fetchFilesByUrls(correctUrls);
    }
  }


  private validateUrl(value) {
    // tslint:disable-next-line
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
  }

}
