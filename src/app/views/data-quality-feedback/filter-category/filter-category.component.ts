import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Category } from './../shared/category';

@Component({
  selector: 'app-filter-category',
  templateUrl: './filter-category.component.html',
  styleUrls: ['./filter-category.component.scss']
})
export class FilterCategoryComponent implements OnInit {
  @Input() categories: Category[] = [];
  @Output() selectedChanged = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  allSelected(): boolean {
    return this.categories.every(x => x.show === true);
 }

  selectionChanged() {
    this.selectedChanged.emit('');
  }

  selectAll(): void {
    this.categories.forEach(x => x.show = true);
    this.selectionChanged();
  }

}
