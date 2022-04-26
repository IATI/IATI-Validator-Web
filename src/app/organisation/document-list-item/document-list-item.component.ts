import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Document } from '../../shared/document';
import { DocumentService } from '../shared/document.service';

@Component({
  selector: 'app-document-list-item',
  templateUrl: './document-list-item.component.html',
  styleUrls: ['./document-list-item.component.scss'],
})
export class DocumentListItemComponent implements OnInit {
  @Input() document!: Document;
  @Input() hideTitle?: boolean;

  constructor(private documentService: DocumentService, private router: Router,) {}

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
    return this.documentService.getDocumentStatus(this.document, display);
  }

  datastoreAvailability(): string {
    return this.documentService.getDocumentDatastoreAvailability(this.document, this.fileStatus());
  }

  rowClick() {
    if (this.hasValidation()) {
      this.router.navigate(['view', 'dqf', 'files', this.document.id]);
      console.log('Validation Report Link Clicked', this.document.id);
    }
  }
}
