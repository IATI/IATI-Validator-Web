import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TypeMessage } from './../shared/type-message';
import { TypeSeverity } from './../shared/type-severity';

@Component({
  selector: 'app-filter-type-message',
  templateUrl: './filter-type-message.component.html',
  styleUrls: ['./filter-type-message.component.scss']
})
export class FilterTypeMessageComponent implements OnInit {
  @Input() typeMessage: TypeMessage = {id: '', text: '', show: true, count: 0};
  @Output() selectedChanged = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  selectionChanged() {
    this.selectedChanged.emit('');
  }

}
