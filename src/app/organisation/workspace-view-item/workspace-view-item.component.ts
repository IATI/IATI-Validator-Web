import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Version } from '../shared/version';
import { OrganisationService } from '../shared/organisation.service';

@Component({
  selector: 'app-workspace-view-item',
  templateUrl: './workspace-view-item.component.html',
  styleUrls: ['./workspace-view-item.component.scss']
})
export class WorkspaceViewItemComponent implements OnInit {
  @Input() version: Version;

  versionid = '';
  versionData: Version;
  error: any;

  constructor(private router: Router,
              private activateRoute: ActivatedRoute,
              private organisationService: OrganisationService) {

                this.activateRoute
                .params
                .subscribe(params => {
                  // this.organisationId = params['organisation'];
                  // this.workspaceid = params['workspace'];
                  this.versionid = params['version'] || '';
                });

               }

  ngOnInit() {
    this.loadVersionData();
  }

  loadVersionData() {
    if (this.versionid  === '' ) {
      console.log('no version id');
      this.versionData = undefined;
    } else {
      console.log('version id: ', this.versionid);
      this.organisationService.getVersion(this.versionid)
      .subscribe(
        data => this.versionData = data[0] ,
        error => this.error = error
      );
    }
  }

  rowClick(viewType: string, item: string) {
    console.log(viewType, item);
    this.router.navigate(['view', viewType, item] );
    // Routerlink naar de view pagina
  }
  // this.router.navigate(['organisation', this.organisationId, 'ws', this.workspaceid, versionNew], { skipLocationChange: false });
}
