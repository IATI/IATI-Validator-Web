import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

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
}
