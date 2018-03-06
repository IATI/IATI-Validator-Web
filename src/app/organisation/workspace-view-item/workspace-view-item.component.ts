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
  @Input() versionid: string;

  versionData: Version;
  viewData = [] ;
  previousViewType = '';
  error: any;

  constructor(private router: Router,
              private organisationService: OrganisationService) {
               }

  ngOnInit() {
    // Loading version data in ngOnChanges, which also fires when the page loads
    // Excecuting it here would be double
    // this.loadVersionData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.versionid.currentValue !== changes.versionid.previousValue) {
      this.loadVersionData();
    }
  }

  loadVersionData() {
    if (this.versionid  === '' ) {
      this.versionData = undefined;
    } else {
      this.organisationService.getVersion(this.versionid)
      .subscribe(
        data => {
          this.versionData = data[0];

          // Sort views by type
          this.versionData.views.sort(function(a, b) {
            if (a.type < b.type) {
              return -1;
            }
            if (a.type > b.type) {
              return 1;
            }
            // type is equal
            return 0;
          });

          // transform the versionData, so that it is grouped by type
          this.viewData.length = 0;
          let previousView = '';
          let indexCurrent = 0;
          for (const view of this.versionData.views) {
            if (view.type !== previousView) {
              this.viewData.push({ type: view.type, typeName: view.type_name, views: [] });
            }
            indexCurrent = this.viewData.length - 1;
            this.viewData[indexCurrent].views.push(view);
            previousView = view.type;
          }

          console.log(this.viewData);

        } ,
        error => this.error = error
      );
    }
  }

  rowClick(viewType: string, item: string) {
    // Routerlink naar de view pagina
    this.router.navigate(['view', viewType, item] );
  }
}
