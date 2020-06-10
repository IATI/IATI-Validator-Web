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
  environmentUrl = window.__env.baseUrl;

  constructor(private readonly router: Router) {
    this.tmpWorkspaceId = this.router.parseUrl(this.router.url).queryParams.tmpWorkspaceId;
  }

  async ngOnInit() {
    if (window.__env.stagePass === null) {
      return;
    }

    let password = null;

    const getPass = async () => {
      password = window.prompt('Please enter the passphrase to enter the staging site.', '');
    };

    while (password !== window.__env.stagePass) {
      await getPass();
    }
  }

  setActiveMode(mode: Mode) {
    this.mode = mode;
  }

  clear() {
    this.mode = Mode.both;
  }

}
