import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  activeTab = 'feadback';

  constructor() { }

  @Input('title') title: string;

  ngOnInit() {
    this.activeTab = window.location.pathname.substr(1);
  }

}
