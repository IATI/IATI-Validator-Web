import { Component, OnInit, Input } from '@angular/core';
import { Document } from '../../shared/document';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {
  @Input() documents: Document[];

  constructor() { }

  ngOnInit() {
    // Sort the documents based on severity
    this.documents.sort(this.compareSeverity);
  }

  compareSeverity = (a: Document, b: Document) => this.getSeverity(a) - this.getSeverity(b);

  getSeverity = (document: Document) => {
    let error = -1;
    let warning = -1;
    if (document.report != null) {
      ({ error, warning } = document.report.summary);
    }
    const {validation, valid} = document;

    if (validation === null) {
      return 2;
    } else if (valid === true && error === 0 && warning === 0) {
      return 5;
    } else if (valid === true && error === 0) {
      return 4;
    } else if (valid === true) {
      return 3;
    } else if (valid === false) {
      return 1;
    } else {
      return 2;
    }
  };
}
