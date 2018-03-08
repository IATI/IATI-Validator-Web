import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
  @Input() checked = false;
  @Output() checkedChanged: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  ChangeChecked() {
    this.checked = !this.checked;
    this.checkedChanged.emit(this.checked);
  }

}
