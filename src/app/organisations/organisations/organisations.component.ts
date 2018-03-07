import { Component, OnInit } from '@angular/core';

import { OrganisationsService } from './../shared/organisations.service';
import { Organisation } from '../shared/organisation';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-organisations',
  templateUrl: './organisations.component.html',
  styleUrls: ['./organisations.component.scss']
})
export class OrganisationsComponent implements OnInit {
  organisations: Organisation[] = [];
  filteredOrganisations: Organisation[] = [];
  isSearching = false;

  constructor(private organisationService: OrganisationsService) { }

  ngOnInit() {
    this.searchOrganisation('');
  }

  searchOrganisation(name: string) {
    this.isSearching = true;
    if (this.organisations === undefined || this.organisations.length === 0) {
      // get organisations from the web api
      this.organisationService.getOrganisations()
        .subscribe(org => this.organisations = org,
          error => {console.log(error); this.isSearching = false; },
          () => {
            // finished fetching organisations from web api, filter the organisations by name
            this.filterOrganisations(name);
          });
    } else {
      // organisations already loaded, only apply filter
      this.filterOrganisations(name);
    }
  }

  filterOrganisations(name: string) {
    if (name === null || !name.trim()) {
      // return all organisations
      this.filteredOrganisations = this.organisations.slice(0)
                                      .sort((a, b) => {
                                        // tslint:disable-next-line:max-line-length
                                        return (a.name || '').toString().toLowerCase().localeCompare((b.name || '').toString().toLowerCase()) ;
                                      });
    } else {
      // filter organisations and save in filteredOrganisations
      this.filteredOrganisations = this.organisations
                                      .filter((org) => new RegExp(name, 'gi').test(org.name))
                                      .sort((a, b) => {
                                        // tslint:disable-next-line:max-line-length
                                        return (a.name || '').toString().toLowerCase().localeCompare((b.name || '').toString().toLowerCase()) ;
                                      });
    }
    this.isSearching = false;
  }
}
