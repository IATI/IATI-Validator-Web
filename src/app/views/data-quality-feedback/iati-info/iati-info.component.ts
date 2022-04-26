import { Component, OnInit, Input } from '@angular/core';
import { DocumentService } from 'src/app/organisation/shared/document.service';
import { OrganisationService } from 'src/app/organisation/shared/organisation.service';
import { Dqfs } from '../shared/feedback';

@Component({
  selector: 'app-iati-info',
  templateUrl: './iati-info.component.html',
  styleUrls: ['./iati-info.component.scss']
})
export class IatiInfoComponent implements OnInit {
  @Input() validationReport = {} as any;
  @Input() documentInfo = {} as any;

  constructor(private documentService: DocumentService) { }

  ngOnInit() {
  }

  fileName(): string {
    if ('url' in this.documentInfo) {
      return this.documentInfo.url.split('/').pop();
    } else {
      return 'No filename available';
    }
  }

  datastoreAvailability(): string {
    return this.documentInfo && this.documentInfo.report
      ? this.documentService.getDocumentDatastoreAvailability(
          this.documentInfo,
          this.documentService.getDocumentStatus(this.documentInfo)
        )
      : '';
  }

}
