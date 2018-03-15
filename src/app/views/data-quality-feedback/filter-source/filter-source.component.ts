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

  allSelected(): boolean {
    return this.sources.every(x => x.show === true);
 }

  selectionChanged() {
    this.selectedChanged.emit('');
  }

  selectAll(): void {
    this.sources.forEach(x => x.show = true);
    this.selectionChanged();
  }

}
