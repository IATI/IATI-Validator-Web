import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Source } from './../shared/source';

@Component({
  selector: 'app-filter-source',
  templateUrl: './filter-source.component.html',
  styleUrls: ['./filter-source.component.scss']
})
export class FilterSourceComponent implements OnInit {
  @Input() sources: Source[] = [];
  @Output() selectedChanged = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  selectionChanged() {
    this.selectedChanged.emit('');
  }

}
