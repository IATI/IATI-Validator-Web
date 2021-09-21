import { Component, OnInit, Input } from '@angular/core';
import { Document } from '../../shared/document';
import { Router } from '@angular/router';

@Component({
  selector: 'app-document-list-item',
  templateUrl: './document-list-item.component.html',
  styleUrls: ['./document-list-item.component.scss']
})
export class DocumentListItemComponent implements OnInit {
  @Input()
  document!: Document;

  constructor(private router: Router) { }

  ngOnInit(): void {
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

  hasValidation(): boolean {
    if (this.document.validation) {
      return true;
    } else {
      return false;
    }
  }

  fileStatus(display = false): string {
    let error = -1;
    let warning = -1;
    let valid = null;

    if (this.document.report !== null) {
      ({ valid } = this.document.report);
      error = this.document.report.summary.error;
      warning = this.document.report.summary.warning;
    }

    if (this.document.report === null) {
      return display ? 'N/A' : 'normal';
    } else if (valid === true && error === 0 && warning === 0) {
      return display ? 'Success' : 'success';
    } else if (valid === true && error === 0) {
      return display ? 'Warning' : 'warning';
    } else if (valid === true) {
      return display ? 'Error' : 'error';
    } else if (valid === false) {
      return display ? 'Critical' : 'critical';
    } else {
      return display ? 'N/A' : 'normal';
    }
  }

  isValid(): boolean {
    if (this.document.validation && this.document.valid) {
      return true;
    } else if (this.document.validation && (this.document.valid === false)) {
      return false;
    } else {
      return null;
    }
  }

  reportType(): string {
    if (this.hasValidation()) {
      return 'File Validation report (click to view)';
    } else {
      return '-';
    }
  }

  rowClick() {
    if (this.hasValidation()) {
      this.router.navigate(['view', 'dqf', 'files', this.document.id]);
      console.log('Validation Report Link Clicked', this.document.id);
    }
  }

}
