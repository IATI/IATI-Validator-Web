import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TypeSeverity, TypeMessage } from './../shared/type-message';


@Component({
  selector: 'app-filter-type',
  templateUrl: './filter-type.component.html',
  styleUrls: ['./filter-type.component.scss']
})
export class FilterTypeComponent implements OnInit {
  @Input() types: TypeSeverity[] = [];
  @Output() selectedChanged = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  allSelected(): boolean {
    return this.types.every(x => x.types.every(y => y.show === true) );
 }

  selectionChanged() {
    this.selectedChanged.emit('');
  }

  selectAll(): void {
    this.types.forEach(x => x.types.forEach(t => t.show = true ));
    this.selectionChanged();
  }
}
