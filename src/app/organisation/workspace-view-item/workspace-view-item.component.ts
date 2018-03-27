import { LogService } from './../../core/logging/log.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Version } from '../shared/version';
import { OrganisationService } from '../shared/organisation.service';

@Component({
  selector: 'app-workspace-view-item',
  templateUrl: './workspace-view-item.component.html',
  styleUrls: ['./workspace-view-item.component.scss']
})
export class WorkspaceViewItemComponent implements OnInit, OnChanges {
  @Input() workspaceId = '';
  @Input() versionSlug = '';

  versionData: Version = this.organisationService.getEmptyVersion();

  viewData = [] ;
  previousViewType = '';
  error: any;

  constructor(private router: Router,
              private organisationService: OrganisationService,
              private logger: LogService) {
               }

  ngOnInit() {
    // Loading version data in ngOnChanges, which also fires when the page loads
    // Excecuting it here would be double
    // this.loadVersionData();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.logger.debug('ngOnChanges', changes);
    this.loadVersionData();

    // if (changes.versionSlug) {
    //   this.logger.debug('Changes versionsluig');
    //   if ( changes.versionSlug.currentValue !== changes.versionSlug.previousValue) {
    //     this.loadVersionData();
    //   }
    // }
  }

  loadVersionData() {
    this.logger.debug('LoadVersionData');
    if (this.workspaceId === undefined || this.workspaceId === '') {
      return;
    }

    if (this.versionSlug  === '' || this.versionSlug === 'latest' ) {
      this.versionData = undefined;
    } else {
      this.organisationService.getVersion(this.workspaceId, this.versionSlug)
      .subscribe(
        data => {
          this.versionData = data[0];

          // BW 12-3-2018: Temporary disable this code until we can get this info
          // from the workbench api.
          // Sort views by type
          // this.versionData.views.sort(function(a, b) {
          //   if (a.type < b.type) {
          //     return -1;
          //   }
          //   if (a.type > b.type) {
          //     return 1;
          //   }
          //   // type is equal
          //   return 0;
          // });

          // // transform the versionData, so that it is grouped by type
          // this.viewData.length = 0;
          // let previousView = '';
          // let indexCurrent = 0;
          // for (const view of this.versionData.views) {
          //   if (view.type !== previousView) {
          //     this.viewData.push({ type: view.type, typeName: view.type_name, views: [] });
          //   }
          //   indexCurrent = this.viewData.length - 1;
          //   this.viewData[indexCurrent].views.push(view);
          //   previousView = view.type;
          // }

        } ,
        error => this.error = error
      );
    }
  }

  rowClick(viewType: string, item: string) {
    // Routerlink naar de view pagina
    this.router.navigate(['view', viewType, item] );
  }

  md5Selected(md5: String) {
    this.logger.debug('Selected md5: ', md5);
  }

}
