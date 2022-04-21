import { Component, OnInit, Input } from '@angular/core';
import { Document } from '../../shared/document';
import { Router } from '@angular/router';

@Component({
  selector: 'app-document-list-item',
  templateUrl: './document-list-item.component.html',
  styleUrls: ['./document-list-item.component.scss'],
})
export class DocumentListItemComponent implements OnInit {
  @Input()
  document!: Document;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.document.hash === '') {
      this.document.report = null;
      this.document.validation_created = null;
    }
  }

  fileName(): string {
    if ('url' in this.document) {
      const filename = this.document.url.replace(/\/$/, '').split('/').pop();

      if (filename.length > 0) {
        return filename;
      }
    }

    return 'No filename available';
  }

  downloadErrorString(): string {
    if ('download_error' in this.document) {
      if (this.document.download_error !== null) {
        return this.document.download_error.toString();
      }
    }
    return '';
  }

  hasValidation(): boolean {
    if (this.document.validation && this.document.hash) {
      return true;
    } else {
      return false;
    }
  }

  fileStatus(display = false): string {
    const { report } = this.document;
    const { valid } = report || { valid: null };
    const { error, warning } = report ? report.summary : { error: -1, warning: -1 };

    if (this.document.report === null) {
      return display ? 'N/A' : 'normal';
    }
    if (valid === true && error === 0 && warning === 0) {
      return display ? 'Success' : 'success';
    }
    if (valid === true && error === 0) {
      return display ? 'Warning' : 'warning';
    }
    if (valid === true) {
      return display ? 'Error' : 'error';
    }
    if (valid === false) {
      return display ? 'Critical' : 'critical';
    }

    return display ? 'N/A' : 'normal';
  }

  rowClick() {
    if (this.hasValidation()) {
      this.router.navigate(['view', 'dqf', 'files', this.document.id]);
      console.log('Validation Report Link Clicked', this.document.id);
    }
  }
}
