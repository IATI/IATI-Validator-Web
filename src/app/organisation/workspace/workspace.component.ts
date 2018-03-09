import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationEnd, RouterLink } from '@angular/router';
import 'rxjs/add/operator/filter';

import { OrganisationService } from '../shared/organisation.service';
import { Organisation } from './../shared/organisation';
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
  organisationData: Organisation;
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

      this.organisationService.getOrganisation(this.organisationId)
        .subscribe(
          data => this.organisationData = (data )  ,
          error => this.error = error,
          () => {
            this.workspaceData = this.organisationData.workspaces.find(ws => ws.slug === workspaceid);
            this.versions = this.workspaceData.versions;

            // if version = latest, then set the last version and select it
            if (this.versionid === 'latest') {
              // TODO: get latest modified version. Now it is the first item in the array.
              // This must be the item with the youngest last_modified date.
              this.versionid = this.versions[0].slug;
              // tslint:disable-next-line:max-line-length
              this.router.navigate(['organisation', this.organisationId, 'ws', this.workspaceid, this.versionid], { skipLocationChange: false, replaceUrl: true });
            }

          }
        );

      // this.organisationService.getWorkspace(workspaceid)
      //   .subscribe(
      //     data => this.workspaceData = (data || this.organisationService.getEmptyWorkspace())  ,
      //     error => this.error = error
      //   );

      // this.organisationService.getVersions(workspaceid)
      //   .subscribe(
      //     data => this.versions = data   ,
      //     error => this.error = error,
      //     () => {
      //       // if version = latest, then set the last version and select it
      //       if (this.versionid === 'latest') {
      //         // TODO: get latest modified version. Now it is the first item in the array.
      //         // This must be the item with the youngest last_modified date.
      //         this.versionid = this.versions[0].slug;
      //         // tslint:disable-next-line:max-line-length
      //         this.router.navigate(['organisation', this.organisationId, 'ws', this.workspaceid, this.versionid], { skipLocationChange: false, replaceUrl: true });
      //       }
      //     }
      //   );

    }

    selectedVersion(versionNew: string) {
      if (this.versionid !== versionNew) {
        this.versionid = versionNew;
      }
      // tslint:disable-next-line:max-line-length
      this.router.navigate(['organisation', this.organisationId, 'ws', this.workspaceid, this.versionid], { skipLocationChange: false });
    }

}
