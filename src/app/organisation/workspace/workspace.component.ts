import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { OrganisationService } from '../shared/organisation.service';
import { Organisation } from './../shared/organisation';
import { Workspace } from './../shared/workspace';
import { Version } from './../shared/version';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  organisationSlug = '';
  workspaceSlug = '';
  versionSlug = '';
  workspaceId = '';
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
        this.organisationSlug = params['organisation'];
        this.workspaceSlug = params['workspace'];
        this.versionSlug = params['version'] || '';
      });

  }

  ngOnInit() {
    this.loadWorkspace(this.organisationSlug, this.workspaceSlug);
  }

  loadWorkspace(organisationSlug: string, workspaceSlug: string) {
    this.organisationService.getWorkspace(organisationSlug, workspaceSlug)
      .subscribe(
        data => this.workspaceData = data,
        error => this.error = error,
        () => {
          // Completed
          this.versions = this.workspaceData.versions ? this.workspaceData.versions : [];
          this.workspaceId = this.workspaceData.id;

          // if version = latest, then set the last version and select it
          if (this.versions.length > 0 && this.versionSlug === 'latest') {
            // TODO: get latest modified version. Now it is the first item in the array.
            // This must be the item with the youngest last_modified date.
            this.versionSlug = this.versions[0].slug;
            // eslint-disable-next-line max-len
            this.router.navigate(['organisation', this.organisationSlug, 'ws', this.workspaceSlug, this.versionSlug], { skipLocationChange: false, replaceUrl: true });
          }
        }
      );

  }

  selectedVersion(versionNew: string) {
    if (this.versionSlug !== versionNew) {
      this.versionSlug = versionNew;
    }
    // eslint-disable-next-line max-len
    this.router.navigate(['organisation', this.organisationSlug, 'ws', this.workspaceSlug, this.versionSlug], { skipLocationChange: false });
  }

}
