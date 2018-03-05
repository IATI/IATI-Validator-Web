import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationEnd, RouterLink } from '@angular/router';
import 'rxjs/add/operator/filter';

import { OrganisationService } from '../shared/organisation.service';
import { Version, View, Property } from './../shared/version';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  organisationId = '';
  workspaceid = '';
  versionid = '';
  versions: Version[];
  error: any;
  currentVersion: Version;

  constructor(private organisationService: OrganisationService,
              private router: Router,
              private activateRoute: ActivatedRoute) {

                this.activateRoute
                .params
                .subscribe(params => {
                  this.organisationId = params['organisation'];
                  this.workspaceid = params['workspace'];
                  this.versionid = params['version'] || '';
                  // console.log('activeRoute version', params['version']);
                });

              }

  ngOnInit() {
    this.LoadVersions(this.workspaceid);
  }

    LoadVersions(workspaceid: string) {
      this.organisationService.getVersions(workspaceid)
        .subscribe(
          data => this.versions = data ,
          error => this.error = error
        );
    }

    selectedVersion(versionNew: string) {
      this.router.navigate(['organisation', this.organisationId, 'ws', this.workspaceid, versionNew], { skipLocationChange: false });
    }

}
