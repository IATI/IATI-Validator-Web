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
    // todo - this, properly - we've no sensitive stuff on the staging site,
    // so this currently is just a quick "hey, you know this is the staging site, right?" check

    if (window.__env.stagePass === null) {
      return;
    }

    console.log(document.cookie);

    if (document.cookie.includes('whynot')) {
      return;
    }

    let password = null;

    const getPass = async () => {
      password = window.prompt('Please enter the passphrase to enter the staging site.', '');
    };

    while (password !== window.__env.stagePass) {
      await getPass();
    }

    document.cookie = 'pass=whynot';
  }

  setActiveMode(mode: Mode) {
    this.mode = mode;
  }

  clear() {
    this.mode = Mode.both;
  }

}
