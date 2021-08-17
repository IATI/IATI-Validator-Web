import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Mode } from '../validate-iati';

@Component({
  selector: 'app-validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.scss']
})
export class ValidateComponent implements OnInit {
  mode: Mode;
  tmpWorkspaceId: string;

  constructor(private readonly router: Router) {
    this.tmpWorkspaceId = this.router.parseUrl(this.router.url).queryParams.tmpWorkspaceId;
  }

  async ngOnInit() {
  }

  setActiveMode(mode: Mode) {
    this.mode = mode;
  }

  clear() {
    this.mode = Mode.both;
  }

}
