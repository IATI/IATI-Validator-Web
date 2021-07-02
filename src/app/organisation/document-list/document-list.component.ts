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
    this.documents = this.documents.sort(this.compareSeverity);
  }

  compareSeverity = (a: Document, b: Document) => this.getSeverity(a) - this.getSeverity(b);

  getSeverity = (document: Document) => {
    let error = -1;
    let warning = -1;
    if ('summary' in document && document.summary !== null) {
      ({ error, warning } = document.summary);
    }
    const {validation, valid} = document;

    if (validation === null) {
      return 3;
    } else if (valid === true && error === 0 && warning === 0) {
      return 4;
    } else if (valid === true && error === 0) {
      return 5;
    } else if (valid === true) {
      return 1;
    } else if (valid === false) {
      return 9;
    } else {
      return 1;
    }
  };
}
