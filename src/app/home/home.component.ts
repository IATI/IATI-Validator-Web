import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  constructor() { }

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
}
