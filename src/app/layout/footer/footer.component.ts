import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  webVersion!: '?';
  serverVersion!: '?';
  actualVersion!: '?';
  constructor() { }

  ngOnInit() {
    this.webVersion = window.__env.valWebVersion;
    this.serverVersion = window.__env.valServerVersion;
    this.actualVersion = window.__env.valActualVersion;
  }

}
