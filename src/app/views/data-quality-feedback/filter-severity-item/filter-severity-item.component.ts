import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Severity } from '../shared/severity';

@Component({
  selector: 'app-filter-severity-item',
  templateUrl: './filter-severity-item.component.html',
  styleUrls: ['./filter-severity-item.component.scss']
})
export class FilterSeverityItemComponent implements OnInit {
  @Input() severity: Severity;
  @Output() selectedChanged = new EventEmitter<string>();

  isCollapsed = true;

  constructor() { }

  ngOnInit() {
    // this.severity.types.sort( (a, b) =>  b.count - a.count );
  }

  collapse() {
    this.isCollapsed = ! this.isCollapsed;
  }

  allSelected(): boolean {
    return this.severity.types.every(x => x.show === true);
 }

  selectionChanged() {
    this.selectedChanged.emit('');
  }

  selectAll(): void {
    this.severity.types.forEach(x => x.show = true);
    this.selectionChanged();
  }

  unSelectAll(): void {
    this.severity.types.forEach(x => x.show = false);
    this.selectionChanged();
  }

  totalTypes(): number {
    return this.severity.types.length;
  }

  totalTypesSelected(): number {
    let count = 0;

    this.severity.types.forEach(x => {
      if (x.show === true) { count++ ; }
    });
    return count;
  }


}
