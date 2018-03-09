import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Severity } from '../shared/severity';

@Component({
  selector: 'app-filter-severity',
  templateUrl: './filter-severity.component.html',
  styleUrls: ['./filter-severity.component.scss']
})
export class FilterSeverityComponent implements OnInit {
  @Input() severities: Severity[] = [];
  @Output() selectedChanged = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  selectionChanged() {
    this.selectedChanged.emit('');
  }

}
