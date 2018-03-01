import { Organisation } from './../shared/organisation';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-organisations-list',
  templateUrl: './organisations-list.component.html',
  styleUrls: ['./organisations-list.component.scss']
})
export class OrganisationsListComponent implements OnInit {
  @Input() organisations: Organisation[] = [];

  constructor() { }

  ngOnInit() {
  }

}
