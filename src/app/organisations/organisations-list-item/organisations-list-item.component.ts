import { Organisation } from '../../shared/organisation';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-organisations-list-item',
  templateUrl: './organisations-list-item.component.html',
  styleUrls: ['./organisations-list-item.component.scss']
})
export class OrganisationsListItemComponent implements OnInit {
  @Input() organisation!: Organisation ;

  constructor() { }

  ngOnInit() {
  }

}
