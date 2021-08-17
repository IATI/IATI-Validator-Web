import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  webVersion!: '?';
  servicesVersion!: '?';
  apiVersion!: '?';
  constructor() { }

  ngOnInit() {
    this.webVersion = window.__env.valWebVersion;
    this.servicesVersion = window.__env.valServicesVersion;
    this.apiVersion = window.__env.valApiVersion;
  }

}
