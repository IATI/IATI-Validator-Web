import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TypeMessage } from './../shared/type-message';
import { TypeSeverity } from './../shared/type-severity';

@Component({
  selector: 'app-filter-type-severity',
  templateUrl: './filter-type-severity.component.html',
  styleUrls: ['./filter-type-severity.component.scss']
})
export class FilterTypeSeverityComponent implements OnInit {
  @Input() type: TypeSeverity;
  @Output() selectedChanged = new EventEmitter<string>();

  isCollapsed = true;

  constructor() { }

  ngOnInit() {
    this.type.types.sort( (a, b) =>  b.count - a.count );
  }

  collapse() {
    this.isCollapsed = ! this.isCollapsed;
  }

  allSelected(): boolean {
    return this.type.types.every(x => x.show === true);
 }

  selectionChanged() {
    this.selectedChanged.emit('');
  }

  selectAll(): void {
    this.type.types.forEach(x => x.show = true);
    this.selectionChanged();
  }
}
