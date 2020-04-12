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

  url = '';
  fileName = '';

  constructor(private readonly fileUploadService: FileUploadService) { }

  ngOnInit() {
  }

  setUrl($event): void {
    if ($event.target.value.length) {
      this.setActiveMode.emit(Mode.urls);
    } else {
      this.clear.emit();
    }

    this.url = $event.target.value;
  }

  fetchFiles() {
    const serializedUrl = this.url.trim();

    this.fileUploadService.fetchFilesByUrls({ name: this.fileName, url: serializedUrl });
  }
}
