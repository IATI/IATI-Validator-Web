import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Source } from './../shared/source';

@Component({
  selector: 'app-filter-category',
  templateUrl: './filter-category.component.html',
  styleUrls: ['./filter-category.component.scss']
})
export class FilterCategoryComponent implements OnInit {
  @Input() sources: Source[] = [];
  @Output() selectedChanged = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  selectionChanged() {
    this.selectedChanged.emit('');
  }

}
