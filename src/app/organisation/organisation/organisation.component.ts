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

  //  = {
  //   display_name: 'Cordaid',
  //   description: '',
  //   image_display_url: 'https://upload.wikimedia.org/wikipedia/en/9/97/CORDAID_logo_RGB.gif',
  //   package_count: 2,
  //   title: 'Cordaid',
  //   is_organization: true,
  //   state: 'active',
  //   image_url: 'https://upload.wikimedia.org/wikipedia/en/9/97/CORDAID_logo_RGB.gif',
  //   type: 'organization',
  //   num_followers: 0,
  //   id: '0557913f-0e99-47ce-a29a-b81d2c023b0b',
  //   name: 'cordaid'
  //  };

  constructor(private organisationService: OrganisationService,
              private activateRoute: ActivatedRoute) {
                this.activateRoute
                .params
                .subscribe(params => {
                  this.name = params['name'];
                });
               }

  ngOnInit() {
    // this.organisationData = this.organisationService.getOrganisation('cordaid');
    this.LoadOrganisation(this.name);
    this.LoadWorkSpaces(this.name);
  }

    LoadOrganisation(name: string) {
      this.organisationService.getOrganisation(name)
        .subscribe(
          data => this.organisationData = data ,
          error => this.error = error
        );
    }

  LoadWorkSpaces(name: string) {
     this.organisationService.getWorkspaces(name)
      .subscribe(
        data => this.workspaces = data , // success path
        error => this.error = error // error path
      );
  }



  ngOnDestroy() {
  }

}
