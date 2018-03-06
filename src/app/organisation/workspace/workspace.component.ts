import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationEnd, RouterLink } from '@angular/router';
import 'rxjs/add/operator/filter';

import { OrganisationService } from '../shared/organisation.service';
import { Workspace } from './../shared/workspace';
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
  workspaceData: Workspace = this.organisationService.getEmptyWorkspace();
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
                });

              }

  ngOnInit() {
    this.LoadVersions(this.workspaceid);
  }

    LoadVersions(workspaceid: string) {

      this.organisationService.getWorkspace(workspaceid)
        .subscribe(
          data => this.workspaceData = (data || this.organisationService.getEmptyWorkspace())  ,
          error => this.error = error
        );

      this.organisationService.getVersions(workspaceid)
        .subscribe(
          data => this.versions = data  ,
          error => this.error = error
        );
    }

    selectedVersion(versionNew: string) {
      // versionNew we don't need, because the select control is two way binded to this.versionid
      // this.versionid = versionNew;
      // this.router.navigate(['organisation', this.organisationId, 'ws', this.workspaceid, versionNew], { skipLocationChange: false });
      this.router.navigate(['organisation', this.organisationId, 'ws', this.workspaceid, this.versionid], { skipLocationChange: false });
    }

}
