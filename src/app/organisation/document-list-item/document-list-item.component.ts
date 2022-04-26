import { Component, OnInit, Input } from '@angular/core';
import { Document } from '../../shared/document';
import { Router } from '@angular/router';
import { OrganisationService } from '../shared/organisation.service';

@Component({
  selector: 'app-document-list-item',
  templateUrl: './document-list-item.component.html',
  styleUrls: ['./document-list-item.component.scss'],
})
export class DocumentListItemComponent implements OnInit {
  @Input() document!: Document;
  @Input() hideTitle?: boolean;

  constructor(private organisationService: OrganisationService, private router: Router,) {}

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
    return this.organisationService.getDocumentStatus(this.document, display);
  }

  datastoreAvailability(): string {
    /* see this ticket for full explanation on these availability statuses
    https://trello.com/c/XeovXQrf/232-front-end-indicator-that-file-is-partially-in-ds-for-al-validation */
    const fileStatus = this.fileStatus();

    return this.organisationService.getDocumentDatastoreAvailability(this.document, fileStatus);
  }

  rowClick() {
    if (this.hasValidation()) {
      this.router.navigate(['view', 'dqf', 'files', this.document.id]);
      console.log('Validation Report Link Clicked', this.document.id);
    }
  }
}
