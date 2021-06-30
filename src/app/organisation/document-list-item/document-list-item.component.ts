import { Component, OnInit, Input } from '@angular/core';
import { Document } from 'src/app/shared/document';
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
      return this.document.url.split('/').pop();
    } else {
      return 'No filename available';
    }
  }

  hasValidation(): boolean {
    if (this.document.validation) {
      return true;
    } else {
      return false;
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
      // this.router.navigate(['view', 'dqf', 'files', this.iatiDatasetData.id]);
      this.router.navigate(['view', 'dqf', 'files', this.document.id]);
      console.log('Validation Report Link Clicked', this.document.id);
    }
  }

}
