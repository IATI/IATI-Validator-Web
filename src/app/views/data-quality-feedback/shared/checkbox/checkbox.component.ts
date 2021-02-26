import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
  @Input() checked = false;
  @Output() checkedChange: EventEmitter<boolean> = new EventEmitter();
  // unique name is necessary for the input control
  @Input() name = '';


  constructor() { }

  ngOnInit() {
  }

  checkedChanged() {
    this.checkedChange.emit(this.checked);
  }

}
