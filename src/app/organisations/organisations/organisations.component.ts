import { Component, OnInit } from '@angular/core';

import { OrganisationsService } from './../shared/organisations.service';
import { Organisation } from '../shared/organisation';

@Component({
  selector: 'app-organisations',
  templateUrl: './organisations.component.html',
  styleUrls: ['./organisations.component.scss']
})
export class OrganisationsComponent implements OnInit {
  organisations: Organisation[] = [];

  constructor(private organisationService: OrganisationsService) { }

  ngOnInit() {
    this.searchOrganisation('');
  }

  searchOrganisation(name: string) {
    this.organisationService.filterOrganisations(name)
      .subscribe(org => this.organisations = org);
  }

}
