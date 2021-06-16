import { Component, OnInit } from '@angular/core';
import { LogService } from '../../core/logging/log.service';
import { Organisation } from '../../shared/organisation';
import { LoaderService } from './../../core/loader/loader.service';
import { OrganisationsService } from './../shared/organisations.service';


@Component({
  selector: 'app-organisations',
  templateUrl: './organisations.component.html',
  styleUrls: ['./organisations.component.scss']
})
export class OrganisationsComponent implements OnInit {
  organisations: Organisation[] = [];
  filteredOrganisations: Organisation[] = [];
  isSearching = false;

  constructor(private organisationService: OrganisationsService,
    private logger: LogService,
    private loader: LoaderService) { }

  async ngOnInit() {
    this.searchOrganisation('');
  }

  searchOrganisation(title: string) {
    // this.logger.debug('Start searching organisations', title);
    this.isSearching = true;
    this.loader.show();
    if (!this.organisations || this.organisations.length === 0) {
      // get organisations from the web api
      this.organisationService.getOrganisations()
        .subscribe(org => this.organisations = org,
          error => {
            console.log(error); this.isSearching = false; this.loader.hide();
          },
          () => {
            // finished fetching organisations from web api, filter the organisations by title
            this.filterOrganisations(title);
          });
    } else {
      // organisations already loaded, only apply filter
      this.filterOrganisations(title);
    }
    // this.logger.debug('End searching organisations', title);
  }

  filterOrganisations(title: string) {
    if (!title || !title.trim()) {
      // return all organisations
      this.filteredOrganisations = this.organisations.slice(0)
        .sort((a, b) =>
          // eslint-disable-next-line max-len
          (a.title || '').toString().toLowerCase().localeCompare((b.title || '').toString().toLowerCase())
        );
    } else {
      // filter organisations and save in filteredOrganisations
      this.filteredOrganisations = this.organisations
        .filter((org) => new RegExp(title, 'gi').test(org.title))
        .sort((a, b) =>
          // eslint-disable-next-line max-len
          (a.title || '').toString().toLowerCase().localeCompare((b.title || '').toString().toLowerCase())
        );
    }
    this.isSearching = false;
    this.loader.hide();
  }
}
