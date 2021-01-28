import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { OrganisationService } from './../shared/organisation.service';
import { Organisation } from '../shared/organisation';

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.scss']
})
export class OrganisationComponent implements OnInit, OnDestroy {
  organisationData: Organisation;
  workspaces: any = [];
  error: any;
  name = '';

  constructor(private organisationService: OrganisationService,
    private activateRoute: ActivatedRoute) {
    this.activateRoute
      .params
      .subscribe(params => {
        this.name = params['name'];
      });
  }

  async ngOnInit() {
    this.loadOrganisation(this.name);
  }

  loadOrganisation(name: string) {
    this.organisationService.getOrganisation(name)
      .subscribe(
        data => {
          this.organisationData = data;
          this.workspaces = this.organisationData ? this.organisationData.workspaces : [];
        },
        error => this.error = error
      );
  }

  hasValidLogo(): boolean {
    if (this.organisationData !== undefined) {
      if ('logo' in this.organisationData) {
        return (this.organisationData.logo !== '');
      }
    }
  }

  ngOnDestroy() {
  }

}
