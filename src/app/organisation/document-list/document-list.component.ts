import { Component, OnInit, Input } from '@angular/core';
import { Document } from '../../shared/document';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {
  @Input()
  documents!: Document[];

  constructor() { }

  ngOnInit(): void {
  }

}
