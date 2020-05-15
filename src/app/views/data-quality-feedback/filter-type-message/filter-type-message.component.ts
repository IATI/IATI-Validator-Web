import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { TypeMessage } from './../shared/type-message';
import { TypeSeverity } from './../shared/type-severity';

@Component({
  selector: 'app-filter-type-message',
  templateUrl: './filter-type-message.component.html',
  styleUrls: ['./filter-type-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterTypeMessageComponent implements OnInit {
  @Input() typeMessage: TypeMessage;
  @Output() selectedChanged = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  selectionChanged() {
    console.log('typeMessage: ', this.typeMessage);
    this.selectedChanged.emit('');
  }

}
