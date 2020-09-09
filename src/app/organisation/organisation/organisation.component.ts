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
    this.LoadOrganisation(this.name);

    // todo - this, properly - we've no sensitive stuff on the staging site,
    // so this currently is just a quick "hey, you know this is the staging site, right?" check

    if (window.__env.stagePass === null) {
      return;
    }

    console.log(document.cookie);

    if (document.cookie.includes('whynot')) {
      return;
    }

    let password = null;

    const getPass = async () => {
      password = window.prompt('Please enter the passphrase to enter the staging site.', '');
    };

    while (password !== window.__env.stagePass) {
      await getPass();
    }

    document.cookie = 'pass=whynot';
  }

  LoadOrganisation(name: string) {
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
