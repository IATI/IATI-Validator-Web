import { Component, OnInit } from '@angular/core';

import { Mode } from '../validate-iati';

@Component({
  selector: 'app-validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.scss']
})
export class ValidateComponent implements OnInit {
  mode: Mode;

  constructor() { }

  ngOnInit() {
  }

  setActiveMode(mode: Mode) {
    this.mode = mode;
  }

  clear() {
    this.mode = Mode.both;
  }

}
